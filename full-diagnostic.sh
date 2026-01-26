#!/bin/bash

echo "🔬 FUNDAMENTAL DIAGNOSTIC"
echo "========================="
echo ""

# 1. Check ACTUAL route structure
echo "1️⃣ ROUTES: What actually exists"
echo "--------------------------------"
echo "Dynamic routes:"
ls -d app/\[*\]/ 2>/dev/null | head -5
echo ""
echo "Static routes:"
ls -d app/*/ 2>/dev/null | grep -v "\[" | head -10
echo ""

# 2. Check middleware - what locales are configured
echo "2️⃣ MIDDLEWARE: Configured locales"
echo "----------------------------------"
if [ -f middleware.ts ]; then
  grep -E "localeCodes|defaultLocale|'us'|'ua'|'sp'|'es'" middleware.ts | head -10
else
  echo "❌ No middleware.ts"
fi
echo ""

# 3. Check i18n config
echo "3️⃣ I18N CONFIG: Locale definitions"
echo "-----------------------------------"
if [ -f i18n/config.ts ]; then
  cat i18n/config.ts
else
  echo "❌ No i18n/config.ts"
fi
echo ""

# 4. Check ALL components with language switching
echo "4️⃣ LANGUAGE SWITCHERS: All instances"
echo "-------------------------------------"
echo "PortalHeader:"
grep -E "href.*us|href.*ua|href.*sp|href.*es" components/PortalHeader.tsx 2>/dev/null || echo "Not found"
echo ""
echo "LanguageSwitcher:"
grep -E "'us'|'ua'|'sp'|'es'" components/LanguageSwitcher.tsx 2>/dev/null | head -5 || echo "Not found"
echo ""
echo "LocaleSwitcher:"
grep -E "'us'|'ua'|'sp'|'es'" components/LocaleSwitcher.tsx 2>/dev/null | head -5 || echo "Not found"
echo ""

# 5. Check GlobalSearch paths
echo "5️⃣ GLOBAL SEARCH: Search data paths"
echo "-------------------------------------"
grep "path:" components/GlobalSearch.tsx 2>/dev/null | head -15 || echo "Not found"
echo ""

# 6. Verify those paths actually exist
echo "6️⃣ PATH VERIFICATION: Do search paths exist?"
echo "---------------------------------------------"
for path in "/modules/transparency" "/modules/veterans" "/modules/emergency"; do
  if [ -f "app${path}/page.tsx" ]; then
    echo "✅ app${path}/page.tsx exists"
  else
    echo "❌ app${path}/page.tsx NOT FOUND"
  fi
done
echo ""

# 7. Check what's actually being used in [locale]/page.tsx
echo "7️⃣ MAIN PAGE: What components are imported?"
echo "---------------------------------------------"
grep "^import" app/\[locale\]/page.tsx 2>/dev/null | head -10 || echo "Not found"
echo ""

# 8. Check running processes
echo "8️⃣ SERVER: What's running?"
echo "---------------------------"
lsof -ti:3000 && echo "✅ Server on :3000" || echo "❌ No server"
lsof -ti:3001 && echo "⚠️  Also on :3001" || echo ""
echo ""

echo "========================="
echo "🎯 SUMMARY OF ISSUES:"
echo "========================="

