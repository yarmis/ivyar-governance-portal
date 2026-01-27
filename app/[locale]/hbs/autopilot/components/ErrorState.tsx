"use client";

import { useTranslation } from '@/i18n/useTranslation';
import { AlertTriangle } from 'lucide-react';

interface Props {
  message?: string;
}

export default function ErrorState({ message }: Props) {
  const { t } = useTranslation();
  
  const displayMessage = message || t.hbsAutopilot?.errors?.noScenarios || 'No scenarios available';
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-heading-m text-text-primary mb-2">
        {t.hbsAutopilot?.errors?.somethingWrong || 'Something went wrong'}
      </h3>
      <p className="text-body-m text-text-secondary text-center max-w-md">
        {displayMessage}
      </p>
    </div>
  );
}
