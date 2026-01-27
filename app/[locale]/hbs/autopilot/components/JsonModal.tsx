"use client";

import { useState } from "react";
import { type AutopilotDecision } from "@/lib/autopilot";
import { X, Copy, Check } from 'lucide-react';

interface Props {
  decision: AutopilotDecision;
  onClose?: () => void;
}

export default function JsonModal({ decision, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(decision, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  // If onClose is provided, we're being controlled externally
  const showModal = onClose ? true : isOpen;

  if (!showModal && !onClose) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-bg-surface border border-border-subtle rounded-lg hover:border-accent-cyan/40 transition-all text-label-m font-medium"
      >
        View Raw JSON
      </button>
    );
  }

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-bg-obsidian border border-border-subtle rounded-card max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle flex-shrink-0">
          <h3 className="text-heading-l">Decision JSON</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 rounded-lg transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-accent-cyan" />
                  <span className="text-label-s text-accent-cyan">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-accent-cyan" />
                  <span className="text-label-s text-accent-cyan">Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-bg-surface rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* JSON Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <pre className="bg-bg-surface border border-border-subtle rounded-lg p-4 overflow-x-auto text-sm text-text-primary font-mono">
            {JSON.stringify(decision, null, 2)}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-subtle flex justify-end flex-shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-accent-cyan text-bg-obsidian rounded-lg font-semibold hover:bg-accent-teal transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
