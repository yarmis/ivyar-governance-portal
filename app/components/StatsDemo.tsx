'use client';

import { useEffect, useState } from 'react';

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  icon?: string;
}

const STATS: Stat[] = [
  { label: 'Production Modules', value: 15, icon: '📦' },
  { label: 'API Endpoints', value: 174, icon: '🔌' },
  { label: 'Languages Supported', value: 6, icon: '🌍' },
  { label: 'Uptime SLA', value: 99.9, suffix: '%', decimals: 1, icon: '⚡' },
  { label: 'Response Time', value: 200, prefix: '<', suffix: 'ms', icon: '🚀' },
  { label: 'Security Standards', value: 3, suffix: ' (ISO/SOC/GDPR)', icon: '🔐' },
];

function AnimatedCounter({ 
  target, 
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = ''
}: { 
  target: number; 
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(target * easeOutQuart);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span className="font-mono">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}

export default function StatsDemo() {
  return (
    <section className="border-y border-[#1F242C] bg-gradient-to-b from-[#0D1117] to-[#161B22] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#E6EDF3] sm:text-4xl">
            Platform at a Glance
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[#8B949E]">
            Enterprise-grade governance infrastructure trusted by international organizations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border border-[#30363D] bg-[#0D1117] p-6 transition-all hover:border-[#00A3FF] hover:shadow-lg hover:shadow-[#00A3FF]/20"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Icon */}
              <div className="mb-3 text-4xl">{stat.icon}</div>
              
              {/* Value */}
              <div className="mb-2 text-4xl font-bold text-[#E6EDF3]">
                <AnimatedCounter
                  target={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              
              {/* Label */}
              <div className="text-sm font-medium text-[#8B949E] group-hover:text-[#00A3FF]">
                {stat.label}
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#00A3FF]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg border border-[#30363D] bg-[#161B22] px-6 py-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-sm font-medium text-[#E6EDF3]">
              Platform Status: Operational
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
