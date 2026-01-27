"use client";

import { useTranslation } from '@/i18n/useTranslation';
import { FileSearch } from 'lucide-react';

export default function EmptyState() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-bg-surface border border-border-subtle rounded-card">
      <div className="w-16 h-16 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center mb-4">
        <FileSearch className="w-8 h-8 text-accent-cyan" />
      </div>
      <h3 className="text-heading-m text-text-primary mb-2">
        {t.hbsAutopilot?.empty?.title || 'Select a scenario to begin'}
      </h3>
      <p className="text-body-m text-text-secondary text-center max-w-md">
        {t.hbsAutopilot?.empty?.subtitle || 'Choose a decision scenario from above to start the AI evaluation process'}
      </p>
    </div>
  );
}
