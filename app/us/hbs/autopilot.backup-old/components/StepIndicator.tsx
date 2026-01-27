"use client";

import { type AutopilotScenario } from "@/lib/autopilot";
import { Check, FileSearch, ClipboardEdit, CheckCircle2 } from 'lucide-react';

interface Props {
  currentStep: 'scenario' | 'input' | 'result';
  scenario: AutopilotScenario | null;
}

const steps = [
  { id: 'scenario', label: 'Select Scenario', icon: FileSearch },
  { id: 'input', label: 'Input Data', icon: ClipboardEdit },
  { id: 'result', label: 'View Decision', icon: CheckCircle2 },
];

export default function StepIndicator({ currentStep, scenario }: Props) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-6">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border-subtle" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-accent-cyan transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            const isPending = index > currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                    ${isCompleted ? 'bg-accent-cyan text-bg-obsidian' : ''}
                    ${isActive ? 'bg-accent-cyan/20 border-2 border-accent-cyan text-accent-cyan' : ''}
                    ${isPending ? 'bg-bg-surface border-2 border-border-subtle text-text-secondary' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Label */}
                <span
                  className={`
                    text-label-s font-medium transition-colors
                    ${isActive || isCompleted ? 'text-text-primary' : 'text-text-secondary'}
                  `}
                >
                  {step.label}
                </span>

                {/* Scenario Name */}
                {step.id === 'scenario' && scenario && index <= currentIndex && (
                  <span className="text-label-xs text-accent-cyan mt-1">
                    {scenario.name}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Description */}
      <div className="mt-6 text-center">
        <p className="text-body-s text-text-secondary">
          {currentStep === 'scenario' && 'Choose a scenario to evaluate'}
          {currentStep === 'input' && 'Provide the necessary information for AI analysis'}
          {currentStep === 'result' && 'Review the AI decision and insights'}
        </p>
      </div>
    </div>
  );
}
