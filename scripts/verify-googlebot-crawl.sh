#!/usr/bin/env bash
# Production crawl checks mirroring Google Search Console / Googlebot expectations.
# Run after deploy or Cloudflare cache purge: npm run verify:crawl

set -euo pipefail

BASE="${VERIFY_BASE_URL:-https://devs-forge.com}"
UA="${VERIFY_USER_AGENT:-Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)}"

CORE_TOOLS=(
  json-formatter
  jwt-decoder
  regex-tester
  base64-encoder
  uuid-generator
  color-palette-generator
  url-encoder
  html-formatter
  timestamp-converter
  json-to-typescript
)

failures=0

check_status() {
  local label="$1"
  local url="$2"
  shift 2
  local status
  status=$(curl -sI -A "$UA" "$@" "$url" | head -1 | awk '{print $2}')
  if [[ "$status" != "200" ]]; then
    echo "FAIL $label: HTTP $status ($url)"
    failures=$((failures + 1))
  else
    echo "OK   $label: HTTP $status"
  fi
}

echo "Base: $BASE"
echo "User-Agent: $UA"
echo ""

check_status "robots.txt" "$BASE/robots.txt"
check_status "sitemap.xml" "$BASE/sitemap.xml"

loc_count=$(curl -s -A "$UA" "$BASE/sitemap.xml" | grep -c "<loc>" || true)
echo "INFO sitemap <loc> count: $loc_count (expected 19)"
if [[ "$loc_count" != "19" ]]; then
  echo "FAIL sitemap URL count: expected 19, got $loc_count"
  failures=$((failures + 1))
fi

sitemap_line=$(curl -s -A "$UA" "$BASE/robots.txt" | grep -i '^Sitemap:' || true)
if [[ "$sitemap_line" != "Sitemap: $BASE/sitemap.xml" ]]; then
  echo "FAIL robots sitemap line: '$sitemap_line' (expected Sitemap: $BASE/sitemap.xml)"
  failures=$((failures + 1))
else
  echo "OK   robots sitemap pointer"
fi

for slug in "${CORE_TOOLS[@]}"; do
  check_status "tool/$slug" "$BASE/tools/$slug"
done

check_status "home" "$BASE/"
check_status "tools index" "$BASE/tools"

chunk_path=$(
  curl -s -A "$UA" "$BASE/tools/json-formatter" |
    grep -oE '/_next/static/chunks/[^"]+\.js' |
    head -1
)
if [[ -z "$chunk_path" ]]; then
  echo "FAIL chunk: could not extract path from json-formatter HTML"
  failures=$((failures + 1))
else
  check_status "chunk" "$BASE$chunk_path" \
    -H "Sec-Fetch-Dest: script" \
    -H "Sec-Fetch-Site: same-origin" \
    -H "Sec-Fetch-Mode: no-cors"
fi

echo ""
if [[ "$failures" -gt 0 ]]; then
  echo "$failures check(s) failed. See docs/gsc-indexing.md for fix matrix."
  exit 1
fi

echo "All Googlebot crawl checks passed."
