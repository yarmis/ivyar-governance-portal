"use client";

import { useTranslation } from '@/i18n/useTranslation';
import { type AutopilotScenario } from "@/lib/autopilot";
import { Building2, ShoppingCart, Users, ArrowRight } from 'lucide-react';

interface Props {
  scenarios: AutopilotScenario[];
  onSelect: (scenario: AutopilotScenario) => void;
}

const SCENARIO_ICONS: Record<string, any> = {
  construction: Building2,
  procurement: ShoppingCart,
  social_support: Users,
};

const SCENARIO_COLORS: Record<string, string> = {
  construction: 'from-orange-500/20 to-red-500/20 border-orange-500/40',
  procurement: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
  social_support: 'from-green-500/20 to-teal-500/20 border-green-500/40',
};

export default function ScenarioCards({ scenarios, onSelect }: Props) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-heading-l mb-2">
          {t.hbsAutopilot?.scenarios?.title || 'Select a Decision Scenario'}
        </h2>
        <p className="text-body-m text-text-secondary">
          {t.hbsAutopilot?.scenarios?.subtitle || 'Choose the type of evaluation you want to perform'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => {
          const Icon = SCENARIO_ICONS[scenario.category || 'construction'] || Building2;
          const colorClasses = SCENARIO_COLORS[scenario.category || 'construction'] || SCENARIO_COLORS.construction;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              className={`
                group relative p-6 rounded-card border bg-bg-surface
                hover:border-accent-cyan/60 transition-all duration-300
                hover:shadow-glow hover:scale-[1.02]
                text-left
                animate-in slide-in-from-bottom
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon Badge */}
              <div className={`
                w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses}
                flex items-center justify-center mb-4
                group-hover:scale-110 transition-transform duration-300
              `}>
                <Icon className="w-6 h-6 text-accent-cyan" />
              </div>

              {/* Content */}
              <h3 className="text-heading-m mb-2 group-hover:text-accent-cyan transition-colors">
                {scenario.name}
              </h3>

              {scenario.description && (
                <p className="text-body-s text-text-secondary mb-4 line-clamp-2">
                  {scenario.description}
                </p>
              )}

              {/* Category Badge */}
              {scenario.category && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full mb-4">
                  <span className="text-label-xs text-accent-cyan uppercase tracking-wide">
                    {scenario.category.replace('_', ' ')}
                  </span>
                </div>
              )}

              {/* Fields Count */}
              {scenario.fields && (
                <div className="flex items-center gap-2 text-label-s text-text-secondary mt-auto">
                  <span>
                    {scenario.fields.length} {t.hbsAutopilot?.scenarios?.fieldsRequired || 'fields required'}
                  </span>
                </div>
              )}

              {/* Arrow Icon */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-accent-cyan" />
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-card bg-gradient-to-br from-accent-cyan/0 to-accent-teal/0 group-hover:from-accent-cyan/5 group-hover:to-accent-teal/5 transition-all duration-300 pointer-events-none" />
            </button>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-accent-cyan/5 border border-accent-cyan/20 rounded-card">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="text-label-m font-semibold text-text-primary mb-1">
              {t.hbsAutopilot?.scenarios?.howItWorks || 'How It Works'}
            </h4>
            <p className="text-body-s text-text-secondary">
              {t.hbsAutopilot?.scenarios?.howItWorksText || 'Select a scenario above to begin. Our AI will guide you through the evaluation process, providing explainable decisions with confidence scores and detailed reasoning. All decisions are logged for institutional audit compliance.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
