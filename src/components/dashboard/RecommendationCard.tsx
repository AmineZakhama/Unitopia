import React from 'react';
import { cn } from '@/lib/utils';

// Maps to RecommendationStatus enum
interface RecommendationCardProps {
  title: string;
  description: string;
  type: string;
  difficulty: string | null;
  estimatedHours: number | null;
  tags: string[];
  provider?: string;
  relevanceScore: number;
  status: string; // PENDING, VIEWED, etc.
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  VIEWED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  COMPLETED: 'bg-green-500/10 text-green-400 border-green-500/20',
  DISMISSED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-500/10 text-green-400',
  Intermediate: 'bg-yellow-500/10 text-yellow-400',
  Advanced: 'bg-red-500/10 text-red-400',
};

export function RecommendationCard({
  title,
  description,
  type,
  difficulty,
  estimatedHours,
  tags,
  provider,
  relevanceScore,
  status,
}: RecommendationCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 p-5 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-sky-500/10">
      {/* Relevance Score Badge */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-sky-500/20 border border-sky-500/30">
          <svg className="w-3 h-3 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-semibold text-sky-400">
            {Math.round(relevanceScore * 100)}%
          </span>
        </div>
      </div>
      
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-100 mb-2 pr-16 group-hover:text-sky-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
      </div>
      
      {/* Meta Information */}
      <div className="flex flex-wrap gap-2 mb-4">
        {difficulty && (
            <span className={cn(
            "px-2 py-1 rounded-md text-xs font-medium",
            difficultyColors[difficulty] || 'bg-slate-700 text-gray-300'
            )}>
            {difficulty}
            </span>
        )}
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-700 text-gray-300">
          {type.replace('_', ' ')}
        </span>
        {estimatedHours && (
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-700 text-gray-300 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {estimatedHours}h
            </span>
        )}
      </div>
      
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-0.5 rounded-full text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-gray-500/10 text-gray-400">
            +{tags.length - 3} more
          </span>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        {provider && (
          <span className="text-xs text-gray-400">via {provider}</span>
        )}
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium border",
          statusColors[status] || statusColors.PENDING
        )}>
          {status.replace('_', ' ')}
        </span>
      </div>
      
      {/* Hover Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 via-sky-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
