#!/bin/bash
# Push tableaugen-mcp files to github.com/twilize5/tableaugen-mcp
# Run this from the folder that contains the files.

set -e

echo "==> Initializing git repo..."
git init

echo "==> Staging files..."
git add .

echo "==> Committing..."
git commit -m "Initial commit: TabGen MCP server metadata + wrapper"

echo "==> Setting main branch..."
git branch -M main

echo "==> Adding remote..."
git remote add origin https://github.com/twilize5/tableaugen-mcp.git

echo "==> Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done. Verify at: https://github.com/twilize5/tableaugen-mcp"
