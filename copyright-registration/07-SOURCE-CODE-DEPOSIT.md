# Source Code Deposit

## Instructions
The U.S. Copyright Office requires a deposit of source code.
For proprietary software, you may submit:
- First 25 pages + Last 25 pages of source code
- You may redact trade secrets (block out up to 50%)

## Generating Code Deposit

Run these commands to create the deposit files:
```bash
# Create deposit folder
mkdir -p copyright-registration/code-deposit

# First 25 pages (approximately 1250 lines)
head -1250 app/[locale]/page.tsx > copyright-registration/code-deposit/first-pages.txt
head -500 i18n/translations.ts >> copyright-registration/code-deposit/first-pages.txt
head -500 components/LocaleSwitcher.tsx >> copyright-registration/code-deposit/first-pages.txt

# Last 25 pages
tail -500 app/hbs/page.tsx > copyright-registration/code-deposit/last-pages.txt
tail -500 app/hbs/prometheus/page.tsx >> copyright-registration/code-deposit/last-pages.txt
tail -250 components/Header.tsx >> copyright-registration/code-deposit/last-pages.txt
```

## File Header (Add to each page)
```
IVYAR Governance Platform
Copyright (c) 2024-2026 IVYAR. All rights reserved.
Author: Igor Yarmosyuk
Page X of 50
```
