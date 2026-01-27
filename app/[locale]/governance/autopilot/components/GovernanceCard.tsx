"use client";

import { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { X, type LucideIcon } from 'lucide-react';

interface GovernanceCardData {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  modalContent: {
    fullDescription: string;
    example: string;
    jsonSnippet: any;
  };
}

interface Props {
  card: GovernanceCardData;
}

export default function GovernanceCard({ card }: Props) {
  const [showModal, setShowModal] = useState(false);
  const Icon = card.icon;

  return (
    <>
      {/* Card */}
      <div className="group relative p-6 bg-bg-surface border border-border-subtle rounded-card hover:border-accent-cyan/40 transition-all hover:shadow-glow">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-teal/20 border border-accent-cyan/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-accent-cyan" />
        </div>

        {/* Title */}
        <h3 className="text-heading-m mb-2 group-hover:text-accent-cyan transition-colors">
          {card.title}
        </h3>

        {/* Description */}
        <p className="text-body-s text-text-secondary mb-4 line-clamp-3">
          {card.description}
        </p>

        {/* Button */}
        <button
          onClick={() => setShowModal(true)}
          className="text-label-m text-accent-cyan hover:text-accent-teal transition-colors font-medium"
        >
          View Details →
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-bg-obsidian border border-border-subtle rounded-card max-w-3xl w-full my-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-teal/20 border border-accent-cyan/40">
                  <Icon className="w-6 h-6 text-accent-cyan" />
                </div>
                <h2 className="text-heading-l">{card.title}</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-bg-surface rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Full Description */}
              <div>
                <h3 className="text-heading-m mb-2">Description</h3>
                <p className="text-body-m text-text-secondary leading-relaxed">
                  {card.modalContent.fullDescription}
                </p>
              </div>

              {/* Example */}
              <div>
                <h3 className="text-heading-m mb-2">Example</h3>
                <div className="p-4 bg-bg-surface border border-border-subtle rounded-lg">
                  <p className="text-body-s text-text-secondary italic">
                    "{card.modalContent.example}"
                  </p>
                </div>
              </div>

              {/* JSON Snippet */}
              <div>
                <h3 className="text-heading-m mb-2">Governance Rule Structure</h3>
                <div className="p-4 bg-bg-obsidian rounded-lg overflow-x-auto">
                  <pre className="text-label-s text-text-secondary">
                    {JSON.stringify(card.modalContent.jsonSnippet, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border-subtle flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-accent-cyan text-bg-obsidian rounded-lg font-semibold hover:bg-accent-teal transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
