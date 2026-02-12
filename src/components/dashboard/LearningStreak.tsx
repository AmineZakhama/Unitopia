import React from 'react';

interface LearningStreakProps {
  currentStreak: number;
  longestStreak: number;
}

export function LearningStreak({ currentStreak, longestStreak }: LearningStreakProps) {
  const isFireStreak = currentStreak >= 7;
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 p-6">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-200">Learning Streak</h3>
          <div className="text-3xl animate-float">
            {isFireStreak ? '🔥' : '📚'}
          </div>
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            {currentStreak}
          </span>
          <span className="text-lg text-gray-400">days</span>
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
          {isFireStreak ? "You're on fire! Keep it up! 🔥" : "Keep learning every day!"}
        </p>
        
        <div className="pt-4 border-t border-orange-500/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Longest Streak</span>
            <span className="font-semibold text-orange-400">{longestStreak} days 🏆</span>
          </div>
        </div>
        
        {currentStreak === longestStreak && currentStreak > 0 && (
          <div className="mt-3 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <p className="text-xs text-orange-400 font-medium text-center">
              ✨ New Personal Record! ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
