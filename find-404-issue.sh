#!/bin/bash

echo "🔍 Finding 404 Issue"
echo "==================="
echo ""

# 1. Check if [locale] folder has proper structure
echo "1. [locale] folder structure:"
ls -la app/\[locale\]/ 2>/dev/null || echo "❌ NO [locale] FOLDER!"
echo ""

# 2. Check page.tsx exists and has content
echo "2. page.tsx content (first 30 lines):"
head -30 app/\[locale\]/page.tsx 2>/dev/null || echo "❌ NO page.tsx!"
echo ""

# 3. Check layout.tsx in [locale]
echo "3. layout.tsx in [locale]:"
ls -la app/\[locale\]/layout.tsx 2>/dev/null && echo "✅ Found" || echo "❌ Missing"
echo ""

# 4. Check root layout
echo "4. Root layout.tsx:"
ls -la app/layout.tsx 2>/dev/null && echo "✅ Found" || echo "❌ Missing"
head -20 app/layout.tsx 2>/dev/null
echo ""

# 5. Check if there are conflicting routes
echo "5. Conflicting static routes (us, ua, sp):"
ls -d app/us app/ua app/sp app/es 2>/dev/null || echo "✅ No conflicts"
echo ""

# 6. Check middleware syntax
echo "6. Middleware check:"
node -c middleware.ts 2>&1 && echo "✅ Valid syntax" || echo "❌ Syntax error"
echo ""

# 7. Check i18n config syntax
echo "7. i18n config check:"
if [ -f "i18n/config.ts" ]; then
  head -20 i18n/config.ts
else
  echo "❌ No i18n/config.ts"
fi
echo ""

# 8. Check .next build artifacts
echo "8. .next folder:"
ls -la .next 2>/dev/null | head -5 || echo "Not built yet"
echo ""

# 9. Most important - check TypeScript compilation
echo "9. TypeScript check on page.tsx:"
npx tsc --noEmit app/\[locale\]/page.tsx 2>&1 | head -20 || echo "Checking..."

