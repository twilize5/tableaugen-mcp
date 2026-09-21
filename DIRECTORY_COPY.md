# Ready-to-paste copy for directory listings

Use these when filling in your Glama / mcp.so / Smithery / Product Hunt profiles.

---

## Short tagline (60 chars)
Generate Tableau workbooks from natural language.

## One-liner (~140 chars, for Twitter, ProductHunt, Glama subtitle)
TabGen turns a CSV and a one-line prompt into a real, editable Tableau workbook (.twb / .twbx) that opens directly in Tableau Desktop.

## Short description (~500 chars, for Glama main description)
TabGen is the MCP server that writes to Tableau. Point it at a CSV, describe the dashboard you want, and it generates a real `.twb` or `.twbx` file — with data connections, calculated fields, worksheets, dashboard containers, and filter actions wired together. Open it in Tableau Desktop and ship it, or publish directly to Tableau Cloud. Free to use, no auth required. Works with Claude Desktop, Cursor, VS Code, Windsurf, and any MCP-compatible client.

## Long description (for Product Hunt, blog, mcp.so full page)
Every Tableau developer has lived this loop: a stakeholder drops a CSV in Slack, describes the dashboard they "kind of" want, and you spend the next three hours dragging pills onto shelves, fixing data types, building calculated fields, and arranging worksheets on a dashboard grid. The thinking part took ten minutes. The clicking part took the afternoon.

TabGen is built to compress that afternoon into a single prompt.

Unlike the official Tableau MCP server — which reads from published Tableau content — TabGen writes new Tableau content. Feed it a CSV and a natural-language brief, and it produces an actual editable workbook file that opens directly in Tableau Desktop or publishes to Tableau Cloud via REST.

**Use cases:**
- Presales and POCs — build customer-shaped demo dashboards in minutes
- BI migrations — turn legacy report descriptions into first-draft Tableau workbooks at scale
- Templated reporting — one prompt, one workbook per client or business unit
- Analyst enablement — SQL-fluent analysts skip the Tableau authoring learning curve
- Rapid experimentation — see a proposed KPI as a real dashboard before committing to build it

**Free to use. No auth required. MIT licensed wrapper.**

Learn more at [tableaugen.com](https://tableaugen.com).

## Categories / tags to select
- Business Intelligence
- Data Visualization
- Analytics
- Dashboards
- Reporting
- Enterprise
- Code Generation (secondary)

## Keywords for SEO fields
tableau, tableau mcp, tableau generator, tableau workbook generator, twbx generator, tabgen, tableaugen, ai dashboard, generative bi, business intelligence, mcp server, tableau ai, natural language tableau, csv to tableau

---

## LinkedIn launch post (native, ~1300 chars)

I built the MCP server I wished existed.

TabGen turns a CSV and a one-line prompt into a real, editable Tableau workbook — .twb or .twbx — that opens directly in Tableau Desktop.

Not a screenshot. Not a suggestion. Not "here's how you'd build it." An actual workbook, with data connections, calculated fields, worksheets, dashboard containers, and filter actions wired together.

The official Tableau MCP reads from published content — great for asking questions about dashboards that already exist.

TabGen writes new content — for the 80% of the job that is actually building the thing.

If you spend your days building Tableau dashboards — as a developer, an SE, a consultant, or an analyst — the next workbook you build is probably one paragraph of prose away.

Free to use. Works with Claude Desktop, Cursor, VS Code, and any MCP-compatible client.

→ tableaugen.com
→ Install: `npx tableaugen-mcp`

What would you generate first?

#Tableau #BusinessIntelligence #MCP #GenerativeAI #DataVisualization

---

## Hacker News "Show HN" title
Show HN: TabGen – Generate Tableau workbooks (.twbx) from a CSV and a prompt

## Hacker News body (first comment)
Hi HN — TabGen is an MCP server that writes real, editable Tableau workbooks from natural language.

The official Tableau MCP server reads from published Tableau content. TabGen does the opposite: give it a CSV and a one-line brief and it emits a .twb / .twbx that opens in Tableau Desktop, with data connections, calculated fields, worksheets, dashboard containers, and filter actions wired together.

The interesting engineering piece is that the LLM does not write the XML directly — it reasons about intent, and a deterministic composer serialises the decision into valid Tableau XML. This is the difference between "usually opens" and "opens every time," which matters a lot for a file format Tableau is strict about.

Free to use, no auth. Install: `npx tableaugen-mcp`. Site: tableaugen.com.

Happy to answer questions about the composer architecture, the workbook XML schema, or how it compares to the official Tableau MCP.

---

## awesome-mcp-servers PR line
Under "Business Intelligence" (or "Data Platforms"):

```
- [twilize5/tableaugen-mcp](https://github.com/YOUR_USERNAME/tableaugen-mcp) 📇 🏠 - Generate production-ready Tableau workbooks (.twb / .twbx) from natural language and a CSV.
```
