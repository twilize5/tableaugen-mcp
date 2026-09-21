#!/usr/bin/env node
/**
 * TabGen MCP Server
 * Generate production-ready Tableau workbooks from natural language.
 * https://tableaugen.com
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const TABGEN_API_BASE =
  process.env.TABGEN_API_BASE ?? "https://api.tableaugen.com";

// ---------------------------------------------------------------------------
// Server setup
// ---------------------------------------------------------------------------

const server = new Server(
  {
    name: "tableaugen-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "generate_workbook",
    description:
      "Generate a Tableau workbook (.twb or .twbx) from a CSV file and a natural-language prompt. Returns the path to the generated workbook.",
    inputSchema: {
      type: "object",
      properties: {
        csv_path: {
          type: "string",
          description: "Absolute path to the source CSV file.",
        },
        prompt: {
          type: "string",
          description:
            "Natural-language description of the dashboard to generate (e.g. 'quarterly revenue by region with YoY comparison').",
        },
        output_path: {
          type: "string",
          description:
            "Absolute path where the generated workbook should be saved. Extension determines format (.twb or .twbx).",
        },
        style: {
          type: "string",
          description:
            "Optional style hint: 'corporate', 'executive', 'analytical', or a custom description.",
        },
      },
      required: ["csv_path", "prompt", "output_path"],
    },
  },
  {
    name: "profile_dataset",
    description:
      "Inspect a CSV file and return its schema, inferred data types, cardinality, and null counts. Useful before calling generate_workbook.",
    inputSchema: {
      type: "object",
      properties: {
        csv_path: {
          type: "string",
          description: "Absolute path to the CSV file to profile.",
        },
      },
      required: ["csv_path"],
    },
  },
  {
    name: "publish_to_cloud",
    description:
      "Publish a generated Tableau workbook to Tableau Cloud or Tableau Server via REST API.",
    inputSchema: {
      type: "object",
      properties: {
        workbook_path: {
          type: "string",
          description: "Absolute path to the .twbx file to publish.",
        },
        server_url: {
          type: "string",
          description:
            "Tableau Cloud/Server URL (e.g. 'https://prod-apnortheast-a.online.tableau.com').",
        },
        site_id: {
          type: "string",
          description: "Tableau site ID (content URL).",
        },
        project_name: {
          type: "string",
          description: "Target project name on the Tableau site.",
        },
        pat_name: {
          type: "string",
          description: "Personal Access Token name.",
        },
        pat_secret: {
          type: "string",
          description: "Personal Access Token secret.",
        },
      },
      required: [
        "workbook_path",
        "server_url",
        "site_id",
        "project_name",
        "pat_name",
        "pat_secret",
      ],
    },
  },
  {
    name: "list_templates",
    description:
      "Return the list of built-in dashboard templates TabGen can start from (sales, OEE, finance, marketing, etc.).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "preview_workbook",
    description:
      "Return a thumbnail image (base64 PNG) of a generated Tableau workbook.",
    inputSchema: {
      type: "object",
      properties: {
        workbook_path: {
          type: "string",
          description: "Absolute path to the .twb or .twbx file to preview.",
        },
      },
      required: ["workbook_path"],
    },
  },
];

// ---------------------------------------------------------------------------
// Request handlers
// ---------------------------------------------------------------------------

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "generate_workbook":
        return await generateWorkbook(args as any);
      case "profile_dataset":
        return await profileDataset(args as any);
      case "publish_to_cloud":
        return await publishToCloud(args as any);
      case "list_templates":
        return await listTemplates();
      case "preview_workbook":
        return await previewWorkbook(args as any);
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (err: any) {
    if (err instanceof McpError) throw err;
    throw new McpError(
      ErrorCode.InternalError,
      `${name} failed: ${err?.message ?? String(err)}`
    );
  }
});

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

async function generateWorkbook(args: {
  csv_path: string;
  prompt: string;
  output_path: string;
  style?: string;
}) {
  const csvPath = resolve(args.csv_path);
  const outputPath = resolve(args.output_path);
  const csvContent = readFileSync(csvPath);

  const form = new FormData();
  form.append(
    "csv",
    new Blob([new Uint8Array(csvContent)], { type: "text/csv" }),
    csvPath.split("/").pop() ?? "data.csv"
  );
  form.append("prompt", args.prompt);
  if (args.style) form.append("style", args.style);
  form.append("format", outputPath.endsWith(".twb") ? "twb" : "twbx");

  const res = await fetch(`${TABGEN_API_BASE}/v1/generate`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`TabGen API returned ${res.status}: ${await res.text()}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buf);

  return {
    content: [
      {
        type: "text",
        text: `Workbook generated: ${outputPath} (${buf.length} bytes). Open in Tableau Desktop.`,
      },
    ],
  };
}

async function profileDataset(args: { csv_path: string }) {
  const csvPath = resolve(args.csv_path);
  const csvContent = readFileSync(csvPath, "utf-8");

  const form = new FormData();
  form.append(
    "csv",
    new Blob([csvContent], { type: "text/csv" }),
    csvPath.split("/").pop() ?? "data.csv"
  );

  const res = await fetch(`${TABGEN_API_BASE}/v1/profile`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`TabGen API returned ${res.status}: ${await res.text()}`);
  }

  const profile = await res.json();

  return {
    content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
  };
}

async function publishToCloud(args: {
  workbook_path: string;
  server_url: string;
  site_id: string;
  project_name: string;
  pat_name: string;
  pat_secret: string;
}) {
  const wbPath = resolve(args.workbook_path);
  const wbContent = readFileSync(wbPath);

  const form = new FormData();
  form.append(
    "workbook",
    new Blob([new Uint8Array(wbContent)], {
      type: "application/octet-stream",
    }),
    wbPath.split("/").pop() ?? "workbook.twbx"
  );
  form.append("server_url", args.server_url);
  form.append("site_id", args.site_id);
  form.append("project_name", args.project_name);
  form.append("pat_name", args.pat_name);
  form.append("pat_secret", args.pat_secret);

  const res = await fetch(`${TABGEN_API_BASE}/v1/publish`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`TabGen API returned ${res.status}: ${await res.text()}`);
  }

  const result = await res.json();

  return {
    content: [
      {
        type: "text",
        text: `Published to Tableau Cloud: ${JSON.stringify(result, null, 2)}`,
      },
    ],
  };
}

async function listTemplates() {
  const res = await fetch(`${TABGEN_API_BASE}/v1/templates`);
  if (!res.ok) {
    throw new Error(`TabGen API returned ${res.status}: ${await res.text()}`);
  }
  const templates = await res.json();
  return {
    content: [{ type: "text", text: JSON.stringify(templates, null, 2) }],
  };
}

async function previewWorkbook(args: { workbook_path: string }) {
  const wbPath = resolve(args.workbook_path);
  const wbContent = readFileSync(wbPath);

  const form = new FormData();
  form.append(
    "workbook",
    new Blob([new Uint8Array(wbContent)], {
      type: "application/octet-stream",
    }),
    wbPath.split("/").pop() ?? "workbook.twbx"
  );

  const res = await fetch(`${TABGEN_API_BASE}/v1/preview`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`TabGen API returned ${res.status}: ${await res.text()}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const b64 = buf.toString("base64");

  return {
    content: [
      {
        type: "image",
        data: b64,
        mimeType: "image/png",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("tableaugen-mcp running on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
