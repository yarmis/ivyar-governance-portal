#!/bin/bash

BASE_URL="https://ivyar-governance-portal.vercel.app"

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

echo -e "${BLUE}Testing all 19 API v12 endpoints on production...${NC}"
echo ""

MODULES=(
  transparency feedback knowledge ai-monitor
  infrastructure logistics culture reconstruction procurement
  trade insurance payments freight
  donor-dashboard
  veterans emergency healthcare
)

for module in "${MODULES[@]}"; do
  echo -n "Testing $module... "
  
  response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/v12/$module/metrics")
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" -eq 200 ] && echo "$body" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ PASS${NC} (HTTP $http_code)"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ FAIL${NC} (HTTP $http_code)"
    FAILED=$((FAILED + 1))
    echo "Response: $body" | head -2
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTS:"
echo "   ✅ Passed: $PASSED/19"
echo "   ❌ Failed: $FAILED/19"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
  exit 0
else
  echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
  exit 1
fi
