"use client";

import { useState, useEffect } from "react";
import { type AutopilotScenario } from "@/lib/autopilot";
import { Info, AlertCircle, CheckCircle2, Send } from 'lucide-react';

interface Props {
  scenario: AutopilotScenario;
  onSubmit: (data: Record<string, any>) => void;
  loading: boolean;
  initialValues?: Record<string, any>;
}

export default function DynamicFormWizard({ scenario, onSubmit, loading, initialValues }: Props) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const validateField = (field: any, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} is required`;
    }

    if (field.type === 'number' && value !== '') {
      const num = parseFloat(value);
      if (isNaN(num)) return 'Must be a valid number';
      if (field.min !== undefined && num < field.min) {
        return `Must be at least ${field.min}`;
      }
      if (field.max !== undefined && num > field.max) {
        return `Must be at most ${field.max}`;
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Must be a valid email';
    }

    return null;
  };

  const handleChange = (fieldId: string, value: any, field: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Validate on change if field was touched
    if (touched[fieldId]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldId]: error || ''
      }));
    }
  };

  const handleBlur = (fieldId: string, field: any) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    const error = validateField(field, formData[fieldId]);
    setErrors(prev => ({
      ...prev,
      [fieldId]: error || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    scenario.fields?.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) newErrors[field.id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        scenario.fields?.reduce((acc, f) => ({ ...acc, [f.id]: true }), {}) || {}
      );
      return;
    }

    onSubmit(formData);
  };

  const renderField = (field: any) => {
    const hasError = touched[field.id] && errors[field.id];
    const isValid = touched[field.id] && !errors[field.id] && formData[field.id];

    return (
      <div key={field.id} className="space-y-2">
        <label htmlFor={field.id} className="flex items-center gap-2 text-label-m font-medium text-text-primary">
          {field.label}
          {field.required && <span className="text-red-400">*</span>}
          {field.description && (
            <div className="group relative">
              <Info className="w-4 h-4 text-text-secondary hover:text-accent-cyan cursor-help transition-colors" />
              <div className="absolute left-6 top-0 w-64 p-3 bg-bg-obsidian border border-border-subtle rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <p className="text-label-s text-text-secondary">{field.description}</p>
              </div>
            </div>
          )}
        </label>

        {field.type === 'select' ? (
          <select
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value, field)}
            onBlur={() => handleBlur(field.id, field)}
            className={`
              w-full px-4 py-3 rounded-lg bg-bg-surface border transition-all
              focus:outline-none focus:ring-2 focus:ring-accent-cyan/50
              ${hasError ? 'border-red-400' : isValid ? 'border-green-400' : 'border-border-subtle'}
              ${hasError ? 'focus:border-red-400' : 'focus:border-accent-cyan'}
            `}
            disabled={loading}
          >
            <option value="">Select {field.label.toLowerCase()}...</option>
            {field.options?.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            id={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleChange(field.id, e.target.value, field)}
            onBlur={() => handleBlur(field.id, field)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
            rows={4}
            className={`
              w-full px-4 py-3 rounded-lg bg-bg-surface border transition-all resize-none
              focus:outline-none focus:ring-2 focus:ring-accent-cyan/50
              ${hasError ? 'border-red-400' : isValid ? 'border-green-400' : 'border-border-subtle'}
              ${hasError ? 'focus:border-red-400' : 'focus:border-accent-cyan'}
            `}
            disabled={loading}
          />
        ) : (
          <div className="relative">
            <input
              type={field.type || 'text'}
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value, field)}
              onBlur={() => handleBlur(field.id, field)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}...`}
              min={field.min}
              max={field.max}
              className={`
                w-full px-4 py-3 rounded-lg bg-bg-surface border transition-all
                focus:outline-none focus:ring-2 focus:ring-accent-cyan/50
                ${hasError ? 'border-red-400 pr-10' : isValid ? 'border-green-400 pr-10' : 'border-border-subtle'}
                ${hasError ? 'focus:border-red-400' : 'focus:border-accent-cyan'}
              `}
              disabled={loading}
            />
            {isValid && (
              <CheckCircle2 className="absolute right-3 top-3.5 w-5 h-5 text-green-400" />
            )}
            {hasError && (
              <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-400" />
            )}
          </div>
        )}

        {/* Error Message */}
        {hasError && (
          <div className="flex items-center gap-2 text-label-s text-red-400 animate-in slide-in-from-top">
            <AlertCircle className="w-4 h-4" />
            <span>{errors[field.id]}</span>
          </div>
        )}

        {/* Helper Text */}
        {field.helperText && !hasError && (
          <p className="text-label-s text-text-secondary">{field.helperText}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-8">
      <div className="mb-6">
        <h2 className="text-heading-l mb-2">{scenario.name}</h2>
        {scenario.description && (
          <p className="text-body-m text-text-secondary">{scenario.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {scenario.fields?.map(renderField)}

        {/* Submit Button */}
        <div className="pt-4 border-t border-border-subtle">
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full px-6 py-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2
              ${loading 
                ? 'bg-bg-surface border border-border-subtle text-text-secondary cursor-not-allowed' 
                : 'bg-accent-cyan text-bg-obsidian hover:bg-accent-teal shadow-glow hover:shadow-glow-strong'
              }
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
                Processing Decision...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Run AI Decision Engine
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
