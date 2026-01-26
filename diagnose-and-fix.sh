#!/bin/bash

echo "🔍 IVYAR Portal Diagnostic & Fix"
echo "================================"
echo ""

# 1. Check structure
echo "📁 Checking structure..."
ls -la app/[locale]/ 2>/dev/null || echo "❌ No [locale] folder!"
ls -la app/us/ 2>/dev/null && echo "⚠️  Found /us folder (wrong!)"
ls -la app/ua/ 2>/dev/null && echo "⚠️  Found /ua folder (wrong!)"
ls -la app/sp/ 2>/dev/null && echo "⚠️  Found /sp folder (wrong!)"

echo ""

# 2. Check middleware
echo "🔧 Checking middleware.ts..."
if [ -f middleware.ts ]; then
  grep -E "us|ua|sp|es" middleware.ts | head -5
else
  echo "❌ No middleware.ts!"
fi

echo ""

# 3. Check which Header is actually used
echo "📄 Checking which header is loaded..."
grep -r "PortalHeader\|Header" app/[locale]/page.tsx 2>/dev/null | head -3

echo ""

# 4. Check PortalHeader content
echo "🎨 Checking PortalHeader..."
if [ -f components/PortalHeader.tsx ]; then
  grep -E "'es'|'sp'|\"es\"|\"sp\"" components/PortalHeader.tsx
else
  echo "❌ No PortalHeader.tsx!"
fi

echo ""

# 5. Check current server
echo "🖥️  Server status..."
lsof -ti:3000 && echo "✅ Server running on :3000" || echo "❌ No server running!"

echo ""
echo "================================"
echo "Fix commands:"
echo ""

# Fix 1: Ensure correct structure
if [ ! -d "app/[locale]" ]; then
  echo "mkdir -p app/[locale]"
fi

# Fix 2: Remove wrong folders
[ -d "app/us" ] && echo "rm -rf app/us app/ua app/sp app/es"

# Fix 3: Fix middleware
echo "# Update middleware.ts with correct locales"

# Fix 4: Fix PortalHeader
echo "# Update PortalHeader with US/UA/SP"

