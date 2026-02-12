import React from 'react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedProps {
  activities: Array<{
    id: string;
    type: string;
    description: string;
    points: number;
    createdAt: Date; // Changed from date string to Date object to match Prisma
    // category: 'readiness' | 'citizenship' | 'selfManagement'; // Prisma types are different
  }>;
}

// Helper to map Prisma types to colors/icons
const getTypeConfig = (type: string) => {
  // Simple mapping based on type string inclusion
  if (['LEARNING_DISCIPLINE', 'SKILL_GROWTH', 'ENGAGEMENT', 'CAREER_READINESS', 'AUTONOMY'].includes(type)) {
     return {
        color: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        label: 'Readiness',
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
     }
  }
  if (['SHARED_NOTES', 'HELPED_PEER', 'REPORTED_ISSUE', 'GAVE_FEEDBACK', 'QUALITY_CONTRIBUTION'].includes(type)) {
      return {
        color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        label: 'Citizenship',
        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      }
  }
  // Self Management
  return {
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    label: 'Self Mgmt',
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
  }
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
      return <div className="text-gray-400 text-sm text-center py-4">No recent activity</div>
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const config = getTypeConfig(activity.type);
        
        return (
          <div
            key={activity.id}
            className="relative flex gap-4 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Timeline Line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-700" />
            )}
            
            {/* Icon */}
            <div className={cn(
              "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border",
              config.color
            )}>
              {config.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between mb-1">
                <p className="text-sm font-medium text-gray-200">
                  {activity.description}
                </p>
                <span className="text-xs font-semibold text-sky-400 whitespace-nowrap ml-2">
                  +{activity.points} pts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </span>
                <span className="text-xs text-gray-600">•</span>
                <span className={cn("text-xs capitalize", config.color.split(' ')[1])}>
                  {config.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
