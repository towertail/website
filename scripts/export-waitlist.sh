#!/usr/bin/env bash
# Export the waitlist from the production D1 database as CSV to stdout.
# Usage: scripts/export-waitlist.sh > waitlist.csv
set -euo pipefail
cd "$(dirname "$0")/.."

pnpm --silent wrangler d1 execute towertail-web --remote --json \
  --command "SELECT id, email, hosts, source, country, created_at FROM waitlist ORDER BY id" |
  node -e '
    const out = JSON.parse(require("fs").readFileSync(0, "utf8"));
    const rows = out[0].results;
    const cols = ["id", "email", "hosts", "source", "country", "created_at"];
    const esc = (v) => (v == null ? "" : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, "\"\"")}"` : String(v));
    console.log(cols.join(","));
    for (const r of rows) console.log(cols.map((c) => esc(r[c])).join(","));
  '
