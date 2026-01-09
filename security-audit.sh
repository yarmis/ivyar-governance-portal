#!/bin/bash

echo "🔍 IVYAR Security Audit - Hidden Modules Scanner"
echo "================================================"
echo ""

BASE_URL="${1:-http://localhost:3000}"
TOTAL_FOUND=0
TOTAL_HIDDEN=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test all possible module paths
MODULES=(
  "procurement" "logistics" "donor-dashboard" "data-platform"
  "ai-services" "trade" "insurance" "payments"
  "reconstruction" "freight" "hbs"
  # Potential hidden modules
  "admin" "analytics" "security" "audit" "reports"
  "finance" "hr" "compliance" "governance"
  "inventory" "assets" "contracts" "vendors"
  "projects" "tasks" "notifications" "settings"
  "users" "roles" "permissions" "billing"
  "api-keys" "webhooks" "integrations" "exports"
)

# Test API endpoints
API_PATHS=(
  "/api/auth/login" "/api/auth/logout" "/api/auth/me"
  "/api/auth/emergency" "/api/test-access" "/api/protected-test"
  "/api/analytics" "/api/reports" "/api/audit"
  "/api/users" "/api/roles" "/api/permissions"
  "/api/modules" "/api/config" "/api/settings"
  "/api/admin" "/api/dashboard" "/api/health"
)

echo "📊 Phase 1: Scanning Module Routes"
echo "-----------------------------------"

for module in "${MODULES[@]}"; do
  TOTAL_FOUND=$((TOTAL_FOUND + 1))
  
  # Test /modules/[slug]
  response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/modules/$module")
  
  if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓ FOUND${NC} /modules/$module (200)"
  elif [ "$response" = "307" ] || [ "$response" = "308" ]; then
    echo -e "${BLUE}→ REDIRECT${NC} /modules/$module ($response)"
  elif [ "$response" = "404" ]; then
    echo -e "${RED}✗ NOT FOUND${NC} /modules/$module"
  else
    echo -e "${YELLOW}? UNKNOWN${NC} /modules/$module ($response)"
    TOTAL_HIDDEN=$((TOTAL_HIDDEN + 1))
  fi
  
  # Test direct route
  response2=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$module")
  if [ "$response2" = "200" ] && [ "$response" != "200" ]; then
    echo -e "${YELLOW}⚠ HIDDEN DIRECT${NC} /$module (bypasses /modules)"
    TOTAL_HIDDEN=$((TOTAL_HIDDEN + 1))
  fi
done

echo ""
echo "🔌 Phase 2: Scanning API Endpoints"
echo "-----------------------------------"

for path in "${API_PATHS[@]}"; do
  TOTAL_FOUND=$((TOTAL_FOUND + 1))
  
  # Test GET
  response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$path")
  
  if [ "$response" = "200" ] || [ "$response" = "401" ] || [ "$response" = "403" ]; then
    echo -e "${GREEN}✓ EXISTS${NC} $path (GET: $response)"
  elif [ "$response" = "405" ]; then
    echo -e "${BLUE}→ METHOD${NC} $path (needs POST/PUT/DELETE)"
  elif [ "$response" = "404" ]; then
    echo -e "${RED}✗ NOT FOUND${NC} $path"
  else
    echo -e "${YELLOW}? UNUSUAL${NC} $path ($response)"
  fi
  
  # Test POST
  response_post=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL$path")
  if [ "$response_post" != "$response" ] && [ "$response_post" != "404" ]; then
    echo -e "${YELLOW}  └─ POST: $response_post${NC}"
  fi
done

echo ""
echo "🕵️  Phase 3: Testing Access Control Bypass"
echo "-------------------------------------------"

# Test unauthorized access
for endpoint in "/api/admin" "/api/users" "/api/roles"; do
  response=$(curl -s "$BASE_URL$endpoint" 2>/dev/null)
  
  if echo "$response" | grep -q "success\|data\|users"; then
    echo -e "${RED}🚨 VULNERABILITY${NC} $endpoint - No auth required!"
    TOTAL_HIDDEN=$((TOTAL_HIDDEN + 1))
  elif echo "$response" | grep -q "Unauthorized\|401"; then
    echo -e "${GREEN}✓ PROTECTED${NC} $endpoint"
  fi
done

echo ""
echo "📁 Phase 4: Filesystem Routes Discovery"
echo "----------------------------------------"

# Check actual filesystem
if [ -d "app" ]; then
  echo "Scanning app directory structure..."
  
  # Find all route.ts files
  find app -name "route.ts" -o -name "page.tsx" | while read file; do
    route=$(echo "$file" | sed 's|app||' | sed 's|/route.ts||' | sed 's|/page.tsx||' | sed 's|\[locale\]||' | sed 's|\[slug\]|*|')
    
    if [ -n "$route" ]; then
      echo -e "${BLUE}📄 Found:${NC} $route"
    fi
  done
fi

echo ""
echo "🔐 Phase 5: Authentication Endpoints Test"
echo "------------------------------------------"

# Test emergency access
echo "Testing emergency endpoint..."
response=$(curl -s -X POST "$BASE_URL/api/auth/emergency" \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong","password":"wrong","confirmEmergency":true}')

if echo "$response" | grep -q "Invalid"; then
  echo -e "${GREEN}✓ Emergency protected${NC}"
else
  echo -e "${RED}🚨 Emergency vulnerable${NC}"
fi

# Test login with SQL injection
echo "Testing SQL injection protection..."
response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ivyar.org'\'' OR 1=1--","password":"anything"}')

if echo "$response" | grep -q "success.*true"; then
  echo -e "${RED}🚨 SQL INJECTION VULNERABLE!${NC}"
else
  echo -e "${GREEN}✓ SQL injection protected${NC}"
fi

echo ""
echo "📊 AUDIT SUMMARY"
echo "================"
echo "Total routes tested: $TOTAL_FOUND"
echo "Suspicious findings: $TOTAL_HIDDEN"
echo ""

if [ $TOTAL_HIDDEN -gt 0 ]; then
  echo -e "${YELLOW}⚠️  Review suspicious findings above${NC}"
else
  echo -e "${GREEN}✅ No hidden modules or vulnerabilities detected${NC}"
fi

echo ""
echo "💡 Recommendations:"
echo "- Review all endpoints with unusual status codes"
echo "- Ensure all admin routes require authentication"
echo "- Check direct routes that bypass /modules prefix"
echo "- Verify emergency access is properly restricted"
