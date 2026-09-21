# Publish TabGen to the MCP ecosystem — step-by-step

This is the exact sequence to get `tableaugen-mcp` listed on **Glama, mcp.so, Smithery, the official MCP Registry, and awesome-mcp-servers** with one publish flow.

## Prerequisites

Create accounts (skip any you already have):

- [ ] npm account — https://www.npmjs.com/signup
- [ ] GitHub account — https://github.com/signup
- [ ] Node.js 18+ installed locally

## Step 1: Create the GitHub repo

The MCP Registry uses GitHub OAuth to verify you own the server name, so the repo has to exist first.

```bash
# On github.com, create a NEW public repo named exactly: tableaugen-mcp
# under your account (e.g. github.com/twilize5/tableaugen-mcp)
# Do not initialize with a README — we'll push our own.

# Locally:
cd /path/to/tableaugen-mcp   # this folder
git init
git add .
git commit -m "Initial commit: TabGen MCP server metadata + wrapper"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/tableaugen-mcp.git
git push -u origin main
```

**Then update these files to replace `jico` with your actual GitHub username:**
- `package.json` → `repository.url`, `bugs.url`, `author`
- `server.json` → `name` (must start with `io.github.<your-username>/`), `repository.url`
- `README.md` → any `jico/...` links

## Step 2: Add the actual server code

The metadata is ready, but you need the working MCP server code before publishing to npm. Two options:

**Option A — you already have TabGen code:**
Drop your existing server implementation into `src/index.ts`, make sure `package.json`'s `bin` field points to the compiled output, and `npm run build`.

**Option B — you need scaffolding:**
Use the official MCP TypeScript quickstart as a starting point:
```bash
npx @modelcontextprotocol/create-server tableaugen-mcp
```
Then wire your `generate_workbook`, `profile_dataset`, etc. tool handlers into it.

Either way, before continuing:

```bash
npm install
npm run build
# Test locally:
node dist/index.js
# Should print MCP server startup logs and wait for stdio input.
```

## Step 3: Publish to npm

```bash
npm login
npm publish --access public
```

Verify at: `https://www.npmjs.com/package/tableaugen-mcp`

If the name is already taken, change `name` in `package.json` to something like `@YOUR_NPM_USERNAME/tableaugen-mcp` and republish.

## Step 4: Publish to the official MCP Registry

Install the publisher CLI:

```bash
# macOS:
brew install mcp-publisher

# or via curl (Linux/macOS):
curl -L https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_$(uname -s)_$(uname -m).tar.gz | tar xz
```

Log in with GitHub (the account that owns the repo):

```bash
mcp-publisher login github
```

Publish:

```bash
cd /path/to/tableaugen-mcp
mcp-publisher publish
```

This reads `server.json`, verifies your GitHub ownership of the repo referenced there, and adds TabGen to the official registry.

**This is the moment the cascade starts** — within a few days, Glama, mcp.so, and Smithery all pull TabGen into their directories automatically.

## Step 5: Submit to awesome-mcp-servers

Fork https://github.com/punkpeye/awesome-mcp-servers, then edit `README.md` and add this line under **Business Intelligence** (or the closest existing category):

```markdown
- [twilize5/tableaugen-mcp](https://github.com/YOUR_GITHUB_USERNAME/tableaugen-mcp) 📇 🏠 - Generate production-ready Tableau workbooks (.twb / .twbx) from natural language and a CSV.
```

Open a PR titled: `Add tableaugen-mcp (TabGen: Tableau workbook generator)`

Icon legend used by that repo: 📇 = TypeScript, 🏠 = local server. Adjust if your implementation language differs.

## Step 6: Claim + enhance on Glama directly

Once TabGen appears on `glama.ai/mcp/servers` (usually 1-3 days after step 4):

1. Search for "tableaugen" on glama.ai
2. Click the listing → "Claim this server" (uses GitHub OAuth against the repo owner)
3. Add screenshots, expand the description, link to tableaugen.com prominently
4. **Consider enabling Glama's hosted "try in browser" feature** — lets visitors test-drive TabGen from the directory page without installing anything. Big conversion boost.

## Step 7: Other directories (all free, ~5 minutes each)

- **mcp.so** — auto-indexed from official registry, but you can claim + edit
- **Smithery** (smithery.ai) — auto-indexed; claim to edit
- **Cursor MCP directory** — submit via cursor.com/mcp
- **Product Hunt** — separate launch, worth its own effort with prepared supporters

## What you'll have after this

- ✅ npm package installable via `npx tableaugen-mcp`
- ✅ Listed on the official MCP Registry
- ✅ Listed on Glama, mcp.so, Smithery
- ✅ Linked from awesome-mcp-servers (high-authority backlink)
- ✅ One-click install for Claude Desktop, Cursor, VS Code, Windsurf users
- ✅ Discoverable when developers search "tableau mcp"

## Updating later

Bump `version` in **both** `package.json` and `server.json` (keep them in sync), then:

```bash
npm run build
npm publish
mcp-publisher publish
```

Glama and downstream directories re-sync automatically.
