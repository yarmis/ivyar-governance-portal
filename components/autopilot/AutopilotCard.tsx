'use client';

import { useState } from 'react';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AutopilotModuleDefinition } from '@/data/autopilot-modules';
import { AutopilotModuleModal } from './AutopilotModuleModal';
import { formatNumber } from '@/lib/utils/helpers';

interface AutopilotCardProps {
  module: AutopilotModuleDefinition;
}

export function AutopilotCard({ module }: AutopilotCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const Icon = (Icons[module.icon as keyof typeof Icons] || Icons.Cpu) as LucideIcon;

  const statusColors = {
    active: 'bg-green-500/10 text-green-400 border-green-500/30',
    training: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    offline: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  };

  const accuracyColor = 
    module.accuracy >= 95 ? 'text-green-400' :
    module.accuracy >= 90 ? 'text-yellow-400' : 'text-orange-400';

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative bg-bg-surface border border-border-subtle rounded-card p-6
          transition-all duration-300 cursor-pointer group
          hover:border-accent-cyan/60 hover:bg-white/5 hover:shadow-glow
          ${isHovered ? 'scale-[1.02]' : 'scale-100'}
        `}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-card" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`
                p-3 rounded-lg bg-gradient-to-br from-accent-cyan/10 to-accent-teal/10 
                border border-accent-cyan/20 transition-transform duration-300
                ${isHovered ? 'scale-110 rotate-3' : 'scale-100'}
              `}
            >
              <Icon className="w-6 h-6 text-accent-cyan" />
            </div>
            
            <div className="flex items-center gap-2">
              {/* Pulse indicator for active */}
              {module.status === 'active' && (
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              )}
              <div className={`px-3 py-1 rounded-full border text-xs font-medium ${statusColors[module.status]}`}>
                {module.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-heading-s text-text-primary mb-2 group-hover:text-accent-cyan transition-colors">
            {module.name}
          </h3>
          <p className="text-body-s text-text-secondary mb-4 line-clamp-2">
            {module.description}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-bg-obsidian/50 rounded-lg p-3 border border-border-subtle group-hover:border-accent-cyan/20 transition-colors">
              <div className="text-label-s text-text-secondary mb-1">Accuracy</div>
              <div className={`text-heading-s font-bold ${accuracyColor}`}>
                {module.accuracy}%
              </div>
            </div>
            <div className="bg-bg-obsidian/50 rounded-lg p-3 border border-border-subtle group-hover:border-accent-cyan/20 transition-colors">
              <div className="text-label-s text-text-secondary mb-1">Decisions</div>
              <div className="text-heading-s text-text-primary font-bold">
                {formatNumber(module.decisionsToday)}
              </div>
            </div>
          </div>

          {/* Capabilities with animation */}
          <div className="space-y-1.5">
            {module.capabilities.slice(0, 3).map((capability, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 text-body-s text-text-secondary group-hover:text-text-primary transition-colors"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div className="w-1 h-1 rounded-full bg-accent-cyan group-hover:scale-150 transition-transform" />
                {capability}
              </div>
            ))}
          </div>

          {/* Hover indicator */}
          <div className={`
            absolute bottom-4 right-4 text-accent-cyan text-sm flex items-center gap-1
            transition-all duration-300
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
          `}>
            View Details
            <Icons.ChevronRight className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <AutopilotModuleModal
          module={module}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
