'use client';

import { TrendingUp, Zap, Target, Award, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  description?: string;
  animated?: boolean;
}

function MetricCard({ icon, label, value, trend, trendUp, description, animated }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState('0');
  
  useEffect(() => {
    if (animated) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      const suffix = value.replace(/[0-9.,]/g, '');
      let current = 0;
      const increment = numericValue / 30;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(current.toFixed(value.includes('.') ? 1 : 0) + suffix);
        }
      }, 30);
      
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-card p-6 hover:border-accent-cyan/40 transition-all duration-300 group relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-accent-cyan/10 to-accent-teal/10 border border-accent-cyan/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            {icon}
          </div>
          {trend && (
            <div className={`
              text-xs font-medium px-2 py-1 rounded-full
              ${trendUp 
                ? 'text-green-400 bg-green-500/10 border border-green-500/30' 
                : 'text-red-400 bg-red-500/10 border border-red-500/30'
              }
            `}>
              {trendUp ? '↑' : '↓'} {trend}
            </div>
          )}
        </div>
        
        <div className="text-heading-l text-text-primary mb-2 font-bold group-hover:text-accent-cyan transition-colors">
          {displayValue}
        </div>
        <div className="text-body-s text-text-secondary">{label}</div>
        {description && (
          <div className="text-xs text-text-secondary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

export function AutopilotMetrics() {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    // Animate active count
    let count = 0;
    const timer = setInterval(() => {
      count++;
      setActiveCount(count);
      if (count >= 10) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Zap className="w-6 h-6 text-accent-cyan" />}
          label="Active Modules"
          value={`${activeCount}/10`}
          trend="100%"
          trendUp={true}
          description="All systems operational"
          animated={true}
        />
        
        <MetricCard
          icon={<Target className="w-6 h-6 text-accent-cyan" />}
          label="Average Accuracy"
          value="95.2%"
          trend="2.3%"
          trendUp={true}
          description="Up from last month"
          animated={true}
        />
        
        <MetricCard
          icon={<TrendingUp className="w-6 h-6 text-accent-cyan" />}
          label="Decisions Today"
          value="4,596"
          trend="18%"
          trendUp={true}
          description="Above daily average"
          animated={true}
        />
        
        <MetricCard
          icon={<Award className="w-6 h-6 text-accent-cyan" />}
          label="Human Overrides"
          value="147"
          trend="5%"
          trendUp={false}
          description="3.2% of total decisions"
          animated={true}
        />
      </div>

      {/* Mini Sparkline Charts */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Accuracy Trend */}
        <div className="bg-bg-surface border border-border-subtle rounded-card p-4 hover:border-accent-cyan/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-body-s text-text-secondary">Accuracy Trend</span>
            <span className="text-xs text-green-400">+2.3%</span>
          </div>
          <div className="flex items-end h-12 gap-1">
            {[92, 93, 94, 94.5, 95, 95.1, 95.2].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-green-500/50 to-green-400/30 rounded-t transition-all duration-500 hover:opacity-80"
                style={{ 
                  height: `${(val / 100) * 48}px`,
                  transitionDelay: `${idx * 50}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Decision Volume */}
        <div className="bg-bg-surface border border-border-subtle rounded-card p-4 hover:border-accent-cyan/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-body-s text-text-secondary">Decision Volume</span>
            <span className="text-xs text-accent-cyan">+18%</span>
          </div>
          <div className="flex items-end h-12 gap-1">
            {[3200, 3500, 3800, 4100, 3900, 4300, 4596].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-accent-cyan/50 to-accent-teal/30 rounded-t transition-all duration-500 hover:opacity-80"
                style={{ 
                  height: `${(val / 5000) * 48}px`,
                  transitionDelay: `${idx * 50}ms`
                }}
              />
            ))}
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-bg-surface border border-border-subtle rounded-card p-4 hover:border-accent-cyan/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-body-s text-text-secondary">Avg Response Time</span>
            <span className="text-xs text-yellow-400">127ms</span>
          </div>
          <div className="flex items-end h-12 gap-1">
            {[135, 132, 130, 128, 127, 126, 127].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-gradient-to-t from-yellow-500/50 to-yellow-400/30 rounded-t transition-all duration-500 hover:opacity-80"
                style={{ 
                  height: `${((200 - val) / 200) * 48}px`,
                  transitionDelay: `${idx * 50}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity Indicator */}
      <div className="bg-bg-surface border border-accent-cyan/40 rounded-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Activity className="w-5 h-5 text-accent-cyan" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <span className="text-body-m text-text-primary font-medium">
              System Activity
            </span>
          </div>
          <div className="flex items-center gap-6 text-body-s">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-text-secondary">
                Processing: <span className="text-green-400 font-medium">47</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-text-secondary">
                Queue: <span className="text-yellow-400 font-medium">12</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-cyan" />
              <span className="text-text-secondary">
                Completed: <span className="text-accent-cyan font-medium">4,537</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
