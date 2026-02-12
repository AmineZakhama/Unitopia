import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon: React.ReactNode;
  gradient: string;
  components: {
    label: string;
    value: number;
  }[];
  trend?: 'up' | 'down' | 'neutral';
}

export function ScoreCard({
  title,
  score,
  maxScore = 1000,
  icon,
  gradient,
  components,
  trend = 'up'
}: ScoreCardProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 p-6 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-500/20">
      {/* Gradient Background Effect */}
      <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl bg-gradient-to-br", gradient)} />
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className={cn(
              "text-4xl font-bold bg-clip-text text-transparent inline-block bg-gradient-to-r",
              gradient
            )}>
              {score}
            </span>
            <span className="text-sm text-gray-400">/ {maxScore}</span>
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-gradient-to-br",
          gradient
        )}>
          {icon}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r", gradient)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Score Components */}
      <div className="space-y-3">
        {components.map((component, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{component.label}</span>
            <span className="font-semibold text-gray-200">{component.value}</span>
          </div>
        ))}
      </div>
      
      {/* Trend Indicator */}
      {trend && (
        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-2">
          {trend === 'up' && (
            <>
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-sm text-emerald-500 font-medium">Improving</span>
            </>
          )}
          {trend === 'down' && (
            <>
              <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <span className="text-sm text-red-500 font-medium">Needs attention</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
