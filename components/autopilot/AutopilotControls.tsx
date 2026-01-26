'use client';

import { useState } from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';

export type SortBy = 'accuracy' | 'decisions' | 'name';
export type SortOrder = 'asc' | 'desc';
export type FilterStatus = 'all' | 'active' | 'training' | 'offline';

interface AutopilotControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortChange: (by: SortBy, order: SortOrder) => void;
  totalModules: number;
  filteredCount: number;
}

export function AutopilotControls({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  totalModules,
  filteredCount,
}: AutopilotControlsProps) {
  const [showFilters, setShowFilters] = useState(false);

  const statusOptions: { value: FilterStatus; label: string; color: string }[] = [
    { value: 'all', label: 'All Status', color: 'border-border-subtle text-text-secondary' },
    { value: 'active', label: 'Active', color: 'border-green-500/30 text-green-400' },
    { value: 'training', label: 'Training', color: 'border-yellow-500/30 text-yellow-400' },
    { value: 'offline', label: 'Offline', color: 'border-gray-500/30 text-gray-400' },
  ];

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'decisions', label: 'Decisions' },
    { value: 'name', label: 'Name' },
  ];

  return (
    <div className="space-y-4">
      {/* Main Controls Row */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search modules by name or capability..."
            className="
              w-full pl-12 pr-4 py-3 
              bg-bg-surface border border-border-subtle rounded-card
              text-text-primary placeholder:text-text-secondary
              focus:outline-none focus:border-accent-cyan/60 focus:ring-1 focus:ring-accent-cyan/20
              transition-all duration-200
            "
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          )}
        </div>

        {/* Filter & Sort Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              px-4 py-3 rounded-card border font-medium
              flex items-center gap-2 transition-all
              ${showFilters 
                ? 'border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan' 
                : 'border-border-subtle text-text-secondary hover:border-accent-cyan/40 hover:text-text-primary'
              }
            `}
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>

          <button
            onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
            className="
              px-4 py-3 rounded-card border border-border-subtle
              text-text-secondary hover:border-accent-cyan/40 hover:text-text-primary
              flex items-center gap-2 transition-all
            "
          >
            <ArrowUpDown className="w-5 h-5" />
            Sort
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-bg-surface border border-border-subtle rounded-card p-4 animate-in slide-in-from-top duration-200">
          <div className="space-y-4">
            {/* Status Filter */}
            <div>
              <label className="text-label-s text-text-secondary mb-2 block">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onFilterChange(option.value)}
                    className={`
                      px-4 py-2 rounded-full border text-sm font-medium
                      transition-all
                      ${filterStatus === option.value
                        ? `${option.color} bg-white/5`
                        : 'border-border-subtle text-text-secondary hover:border-accent-cyan/40'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-label-s text-text-secondary mb-2 block">Sort By</label>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onSortChange(option.value, sortOrder)}
                    className={`
                      px-4 py-2 rounded-full border text-sm font-medium
                      transition-all
                      ${sortBy === option.value
                        ? 'border-accent-cyan/60 bg-accent-cyan/10 text-accent-cyan'
                        : 'border-border-subtle text-text-secondary hover:border-accent-cyan/40'
                      }
                    `}
                  >
                    {option.label}
                    {sortBy === option.value && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-body-s text-text-secondary">
        <span>
          Showing <span className="text-accent-cyan font-medium">{filteredCount}</span> of{' '}
          <span className="text-text-primary font-medium">{totalModules}</span> modules
        </span>
        {(searchQuery || filterStatus !== 'all') && (
          <button
            onClick={() => {
              onSearchChange('');
              onFilterChange('all');
            }}
            className="text-accent-cyan hover:text-accent-teal transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
