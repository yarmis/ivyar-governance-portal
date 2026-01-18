#!/bin/bash
BASE_URL="https://ivyar-governance-portal.vercel.app"
echo "Testing API v12 on $BASE_URL"
echo ""
for module in transparency feedback knowledge ai-monitor procurement logistics reconstruction donor payments trade freight insurance materials zoning violations culture veterans emergency healthcare; do
  echo -n "$module... "
  if curl -s "$BASE_URL/api/v12/$module/metrics" | grep -q '"success":true'; then
    echo "✅"
  else
    echo "❌"
  fi
done
