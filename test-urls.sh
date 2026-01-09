#!/bin/bash

# IVYAR Portal - Automated URL Checker
BASE_URL="${1:-http://localhost:3000}"
TOTAL=0
PASSED=0
FAILED=0

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

test_url() {
  local url=$1
  local name=$2
  TOTAL=$((TOTAL + 1))
  
  echo -n "Testing: $name ... "
  response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$url" 2>/dev/null)
  
  if [ "$response" = "200" ] || [ "$response" = "307" ]; then
    echo -e "${GREEN}✓ PASS${NC} ($response)"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}✗ FAIL${NC} ($response)"
    FAILED=$((FAILED + 1))
  fi
}

echo "🧪 IVYAR Portal Test"
echo "Testing: $BASE_URL"
echo ""

# Core
test_url "/" "Home"
test_url "/us" "US locale"
test_url "/login" "Login"

# HBS
test_url "/us/hbs" "HBS main"
test_url "/us/hbs/demo" "HBS demo"
test_url "/us/hbs/autopilot" "HBS autopilot"

# Modules
test_url "/modules/procurement" "Procurement"
test_url "/modules/logistics" "Logistics"
test_url "/modules/donor-dashboard" "Donor Dashboard"
test_url "/modules/data-platform" "Data Platform"
test_url "/modules/ai-services" "AI Services"
test_url "/modules/trade" "Trade"
test_url "/modules/insurance" "Insurance"
test_url "/modules/payments" "Payments"
test_url "/modules/reconstruction" "Reconstruction"
test_url "/modules/freight" "Freight"

echo ""
echo "📊 SUMMARY: $TOTAL tests | Passed: $PASSED | Failed: $FAILED"

[ $FAILED -eq 0 ] && echo -e "${GREEN}✓ ALL PASSED${NC}" || echo -e "${RED}✗ FAILURES${NC}"
