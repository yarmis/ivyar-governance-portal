"use client";

import { useTranslation } from '@/i18n/useTranslation';
import { Layers, Shield, Zap, ArrowRight } from 'lucide-react';

export default function IntegrationMap() {
  const { t } = useTranslation();

  const layers = [
    {
      id: 'institutional',
      title: 'v12 Autopilot',
      subtitle: 'Institutional Layer',
      description: 'Overview of 10 AI modules, architecture showcase, and platform capabilities',
      icon: Layers,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/40',
      textColor: 'text-blue-400',
      url: '/autopilot'
    },
    {
      id: 'constitutional',
      title: 'Governance Autopilot',
      subtitle: 'Constitutional Layer',
      description: 'Authority boundaries, refusal logic, escalation triggers, and compliance rules',
      icon: Shield,
      color: 'from-amber-500/20 to-yellow-500/20',
      borderColor: 'border-amber-500/40',
      textColor: 'text-amber-400',
      url: '/governance/autopilot',
      highlight: true
    },
    {
      id: 'operational',
      title: 'HBS Autopilot',
      subtitle: 'Operational Layer',
      description: 'Working decision engine with scenario evaluation, circular gauge, and history tracking',
      icon: Zap,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/40',
      textColor: 'text-green-400',
      url: '/hbs/autopilot'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-heading-l mb-2">
          {t.governanceAutopilot?.integration?.title || 'How This Layer Fits'}
        </h2>
        <p className="text-body-m text-text-secondary max-w-2xl mx-auto">
          Governance Autopilot is the constitutional foundation between institutional overview and operational execution
        </p>
      </div>

      {/* Integration Flow */}
      <div className="relative">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/40 via-amber-500/40 to-green-500/40 hidden lg:block" 
             style={{ transform: 'translateY(-50%)' }} 
        />

        {/* Layers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {layers.map((layer, idx) => {
            const Icon = layer.icon;
            
            return (
              <div key={layer.id} className="relative">
                <div className={`
                  p-6 rounded-card border ${layer.borderColor}
                  bg-gradient-to-br ${layer.color}
                  ${layer.highlight ? 'ring-2 ring-amber-500/40 shadow-glow' : ''}
                  hover:scale-105 transition-all duration-300
                `}>
                  {/* Layer Number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-bg-obsidian border-2 border-current flex items-center justify-center text-label-m font-bold">
                    {idx + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg border ${layer.borderColor} ${layer.color} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${layer.textColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-heading-m mb-1 ${layer.textColor}`}>
                    {layer.title}
                  </h3>

                  {/* Subtitle */}
                  <div className="text-label-s text-text-secondary uppercase tracking-wide mb-3">
                    {layer.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-body-s text-text-secondary mb-4 min-h-[60px]">
                    {layer.description}
                  </p>

                  {/* Link */}
                  <a
                    href={layer.url}
                    className={`inline-flex items-center gap-2 text-label-m ${layer.textColor} hover:underline font-medium`}
                  >
                    {t.governanceAutopilot?.integration?.visitLayer || 'Visit layer'}
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  {/* Highlight Badge */}
                  {layer.highlight && (
                    <div className="absolute -top-2 -right-2 px-3 py-1 bg-amber-500 text-bg-obsidian rounded-full text-label-xs font-bold uppercase">
                      {t.governanceAutopilot?.integration?.current || 'Current'}
                    </div>
                  )}
                </div>

                {/* Arrow (desktop only) */}
                {idx < layers.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 z-10 w-6 h-6 items-center justify-center bg-bg-obsidian rounded-full border border-border-subtle"
                       style={{ transform: 'translateY(-50%)' }}
                  >
                    <ArrowRight className="w-4 h-4 text-accent-cyan" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Flow Explanation */}
      <div className="bg-bg-surface border border-border-subtle rounded-card p-6">
        <h3 className="text-heading-m mb-3">Three-Layer Architecture</h3>
        <div className="space-y-3 text-body-m text-text-secondary">
          <p>
            <strong className="text-blue-400">Institutional Layer:</strong> Showcases the platform's capabilities and module architecture for executive stakeholders.
          </p>
          <p>
            <strong className="text-amber-400">Constitutional Layer:</strong> Defines what the system can and cannot do, ensuring decisions remain within delegated authority and constitutional bounds.
          </p>
          <p>
            <strong className="text-green-400">Operational Layer:</strong> Executes decisions within the boundaries set by governance rules, providing real-time AI evaluation with full audit trails.
          </p>
        </div>
      </div>
    </div>
  );
}
