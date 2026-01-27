"use client";

import { useEffect, useState } from "react";
import { useTranslation } from '@/i18n/useTranslation';
import { getScenarios, autopilotRequest, type AutopilotScenario, type AutopilotDecision } from "@/lib/autopilot";
import StepIndicator from "./StepIndicator";
import ScenarioCards from "./ScenarioCards";
import DynamicFormWizard from "./DynamicFormWizard";
import AdvancedResultPanel from "./AdvancedResultPanel";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import ComparisonView from "./ComparisonView";
import HistoryPanel from "./HistoryPanel";
import { History, GitCompare } from 'lucide-react';

type WizardStep = 'scenario' | 'input' | 'result';

interface DecisionHistory {
  id: string;
  timestamp: Date;
  scenarioId: string;
  scenarioName: string;
  decision: AutopilotDecision;
  input: Record<string, any>;
}

export default function WizardContainer() {
  const { t } = useTranslation();
  
  // Scenarios
  const [scenarios, setScenarios] = useState<AutopilotScenario[] | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<AutopilotScenario | null>(null);
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('scenario');
  const [decision, setDecision] = useState<AutopilotDecision | null>(null);
  const [inputData, setInputData] = useState<Record<string, any> | null>(null);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced features
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [history, setHistory] = useState<DecisionHistory[]>([]);

  // Load scenarios on mount
  useEffect(() => {
    let cancelled = false;
    async function loadScenarios() {
      try {
        setInitialLoading(true);
        const data = await getScenarios();
        if (!cancelled) setScenarios(data);
      } catch (e) {
        if (!cancelled) setError("Failed to load scenarios");
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    }
    loadScenarios();
    return () => { cancelled = true; };
  }, []);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('autopilot-history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed.map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        })));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const handleScenarioSelect = (scenario: AutopilotScenario) => {
    setSelectedScenario(scenario);
    setCurrentStep('input');
    setError(null);
    setDecision(null);
  };

  const handleFormSubmit = async (input: Record<string, any>) => {
    if (!selectedScenario) return;
    
    setLoading(true);
    setError(null);
    setInputData(input);
    
    try {
      const result = await autopilotRequest({ 
        scenarioId: selectedScenario.id, 
        input 
      });
      setDecision(result);
      setCurrentStep('result');
      
      // Add to history
      const newEntry: DecisionHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        scenarioId: selectedScenario.id,
        scenarioName: selectedScenario.name,
        decision: result,
        input
      };
      
      const newHistory = [newEntry, ...history].slice(0, 20); // Keep last 20
      setHistory(newHistory);
      localStorage.setItem('autopilot-history', JSON.stringify(newHistory));
      
    } catch (e: any) {
      setError(e.message || "Failed to process decision");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('scenario');
    setSelectedScenario(null);
    setDecision(null);
    setInputData(null);
    setError(null);
  };

  const handleBackToInput = () => {
    setCurrentStep('input');
    setDecision(null);
    setError(null);
  };

  if (initialLoading) {
    return <LoadingState message="scenarios" />;
  }

  if (!scenarios || scenarios.length === 0) {
    return <ErrorState message={t.hbsAutopilot?.errors?.noScenarios} />;
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <StepIndicator 
        currentStep={currentStep}
        scenario={selectedScenario}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentStep !== 'scenario' && (
            <button
              onClick={handleStartOver}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border-subtle rounded-lg hover:border-accent-cyan/40 transition-all"
            >
              ← {t.hbsAutopilot?.wizard?.startOver || 'Start Over'}
            </button>
          )}
          {currentStep === 'result' && (
            <button
              onClick={handleBackToInput}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary border border-border-subtle rounded-lg hover:border-accent-cyan/40 transition-all"
            >
              ← {t.hbsAutopilot?.wizard?.editInput || 'Edit Input'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 text-sm font-medium bg-bg-surface border border-border-subtle rounded-lg hover:border-accent-cyan/40 transition-all flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              {t.hbsAutopilot?.wizard?.history || 'History'} ({history.length})
            </button>
          )}
          
          {currentStep === 'result' && decision && (
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="px-4 py-2 text-sm font-medium bg-bg-surface border border-border-subtle rounded-lg hover:border-accent-cyan/40 transition-all flex items-center gap-2"
            >
              <GitCompare className="w-4 h-4" />
              {t.hbsAutopilot?.wizard?.compare || 'Compare'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[500px]">
        {currentStep === 'scenario' && (
          <ScenarioCards
            scenarios={scenarios}
            onSelect={handleScenarioSelect}
          />
        )}

        {currentStep === 'input' && selectedScenario && (
          <DynamicFormWizard
            scenario={selectedScenario}
            onSubmit={handleFormSubmit}
            loading={loading}
            initialValues={inputData || undefined}
          />
        )}

        {currentStep === 'result' && decision && selectedScenario && inputData && (
          <AdvancedResultPanel
            decision={decision}
            scenario={selectedScenario}
            input={inputData}
          />
        )}

        {loading && <LoadingState message="analyzing" />}
        {error && <ErrorState message={error} />}
      </div>

      {/* Comparison View Modal */}
      {showComparison && decision && (
        <ComparisonView
          currentDecision={decision}
          history={history}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* History Panel Modal */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onClose={() => setShowHistory(false)}
          onRerun={(entry) => {
            setSelectedScenario(scenarios.find(s => s.id === entry.scenarioId) || null);
            setInputData(entry.input);
            setCurrentStep('input');
            setShowHistory(false);
          }}
        />
      )}
    </div>
  );
}
