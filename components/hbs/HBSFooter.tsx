'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function HBSFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-gray-400 py-4 text-center text-sm">
      <p>HBS v4.0 — National Governance Cloud — Multi-Country | Sovereign Data | National Audit — © 2026 IVYAR</p>
    </footer>
  );
}