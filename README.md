# TabGen MCP Server

> Generate production-ready Tableau workbooks from natural language and a CSV.

Official MCP (Model Context Protocol) server for [**TabGen**](https://tableaugen.com) — the AI-powered Tableau workbook generator. Turn a CSV plus a one-line prompt into a real `.twb` / `.twbx` file that opens directly in Tableau Desktop or publishes to Tableau Cloud.

## What it does

TabGen writes to Tableau. Point it at a dataset, describe the dashboard you want, and get back an actual editable workbook — not a screenshot, not a suggestion, not a code snippet. The generated file has real data connections, calculated fields, worksheets, dashboard containers, and filter actions wired together.

Use it directly from Claude Desktop, Cursor, VS Code, or any MCP-compatible client.

## Installation

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tableaugen": {
      "command": "npx",
      "args": ["-y", "tableaugen-mcp"]
    }
  }
}
```

### Cursor / Windsurf / VS Code

Add to your MCP settings:

```json
{
  "tableaugen": {
    "command": "npx",
    "args": ["-y", "tableaugen-mcp"]
  }
}
```

### Direct install

```bash
npm install -g tableaugen-mcp
```

Then run:

```bash
tableaugen-mcp
```

## Authentication

None required. TabGen's core generation is free to use.

## Tools

| Tool | Description |
|---|---|
| `generate_workbook` | Generate a Tableau `.twb` / `.twbx` from a CSV path and a natural-language prompt |
| `profile_dataset` | Inspect a CSV and return schema, data types, cardinality, and null counts |
| `publish_to_cloud` | Publish a generated workbook to Tableau Cloud or Tableau Server |
| `list_templates` | Return available dashboard templates (sales, OEE, finance, marketing, etc.) |
| `preview_workbook` | Return a thumbnail image of a generated workbook for inline preview |

## Supported inputs

- CSV files (any dialect, headers auto-detected)

## Supported outputs

- `.twb` — Tableau workbook (XML, no data embedded)
- `.twbx` — Tableau packaged workbook (workbook + extract)
- `.hyper` — Tableau extract only
- Direct publish to Tableau Cloud / Tableau Server via REST API

## Example usage

Once installed, ask your AI client:

> Generate a quarterly sales dashboard from `/data/orders.csv` with a region filter and a product drill-down. Save it to `~/Desktop/sales.twbx`.

TabGen will profile the data, plan the layout, and write a valid Tableau workbook to the path you specified.

## Links

- Website: [tableaugen.com](https://tableaugen.com)
- Issues: [github.com/twilize5/tableaugen-mcp/issues](https://github.com/twilize5/tableaugen-mcp/issues)

## License

MIT
