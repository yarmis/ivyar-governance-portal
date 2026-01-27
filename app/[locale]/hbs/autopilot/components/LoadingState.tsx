"use client";

import { useTranslation } from '@/i18n/useTranslation';
import { Loader2 } from 'lucide-react';

interface Props {
  message?: 'default' | 'scenarios' | 'analyzing';
}

export default function LoadingState({ message = 'default' }: Props) {
  const { t } = useTranslation();
  
  const messageText = t.hbsAutopilot?.loading?.[message] || 'Loading...';
  
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-12 h-12 text-accent-cyan animate-spin mb-4" />
      <p className="text-body-m text-text-secondary">{messageText}</p>
    </div>
  );
}
