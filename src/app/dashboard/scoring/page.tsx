import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStudentProfile, getRecentActivities, getLearningStreak } from '@/app/actions/scoring';
import { getRecommendations } from '@/app/actions/recommendations';
import { ScoreCard } from '@/components/dashboard/ScoreCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { LearningStreak } from '@/components/dashboard/LearningStreak';
import { redirect } from 'next/navigation';

export default async function ScoringDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // redirect('/api/auth/signin'); // Uncomment in production
    // For development, we might not have a session if running locally without setup
     console.log("No session found in scoring dashboard");
  }

  // Fetch all data in parallel
  const [profileResult, activitiesResult, streakResult, recommendationsResult] = await Promise.all([
    getStudentProfile(),
    getRecentActivities(),
    getLearningStreak(),
    getRecommendations('PENDING')
  ]);

  if (!profileResult.success || !profileResult.data) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">Student Profile Not Found</h1>
          <p>Please contact administration to set up your student profile.</p>
        </div>
      </div>
    );
  }

  const profile = profileResult.data;
  const recentActivities = activitiesResult.success ? activitiesResult.data : [];
  const streak = streakResult.success && streakResult.data ? streakResult.data : { currentStreak: 0, longestStreak: 0 };
  const recommendations = recommendationsResult.success && recommendationsResult.data ? recommendationsResult.data : [];

  // Parse JSON components safely
  const readinessComponents = profile.readinessComponents as Record<string, number> || {};
  const citizenshipComponents = profile.citizenshipComponents as Record<string, number> || {};
  const selfManagementComponents = profile.selfManagementComponents as Record<string, number> || {};

  return (
    <div className="min-h-screen bg-slate-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Your Progress
          </h2>
          <p className="text-gray-400">
            Track your University Readiness, Academic Citizenship, and Self-Management scores.
          </p>
        </div>

        {/* Score Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ScoreCard
            title="University Readiness"
            score={profile.readinessScore}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            gradient="from-sky-400 to-blue-600"
            components={[
              { label: 'Learning Discipline', value: readinessComponents.learningDiscipline || 0 },
              { label: 'Skill Growth', value: readinessComponents.skillGrowth || 0 },
              { label: 'Engagement', value: readinessComponents.engagement || 0 },
              { label: 'Career Readiness', value: readinessComponents.careerReadiness || 0 },
              { label: 'Autonomy', value: readinessComponents.autonomy || 0 },
            ]}
            trend="up"
          />

          <ScoreCard
            title="Academic Citizenship"
            score={profile.citizenshipScore}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            gradient="from-purple-400 to-indigo-600"
            components={[
              { label: 'Shared Notes', value: citizenshipComponents.sharedNotes || 0 },
              { label: 'Helped Peers', value: citizenshipComponents.helpedPeers || 0 },
              { label: 'Reported Issues', value: citizenshipComponents.reportedIssues || 0 },
              { label: 'Gave Feedback', value: citizenshipComponents.gaveFeedback || 0 },
              { label: 'Quality Contrib.', value: citizenshipComponents.qualityContributions || 0 },
            ]}
            trend="up"
          />

          <ScoreCard
            title="Self-Management"
            score={profile.selfManagementScore}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
            gradient="from-emerald-400 to-green-600"
            components={[
              { label: 'Appointments', value: selfManagementComponents.appointments || 0 },
              { label: 'Deadlines', value: selfManagementComponents.deadlines || 0 },
              { label: 'Attendance', value: selfManagementComponents.attendance || 0 },
              { label: 'Admin Interactions', value: selfManagementComponents.adminInteractions || 0 },
            ]}
            trend="up"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recommendations and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommendations Section */}
            <section className="animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-100">Personalized Recommendations</h2>
                  <p className="text-sm text-gray-400 mt-1">Curated based on your interests and goals</p>
                </div>
                <button className="px-4 py-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 transition-colors text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {recommendations.length > 0 ? (
                    recommendations.slice(0, 4).map((rec: any) => (
                      <RecommendationCard key={rec.id} {...rec} />
                    ))
                 ) : (
                    <div className="col-span-2 text-center text-gray-500 py-8 bg-slate-800 rounded-xl border border-slate-700">
                        No recommendations yet.
                    </div>
                 )}
              </div>
            </section>

            {/* Recent Activity Section */}
            <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-100">Recent Activity</h2>
                <p className="text-sm text-gray-400 mt-1">Your latest achievements and contributions</p>
              </div>
              
              <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6">
                <ActivityFeed activities={recentActivities as any} />
              </div>
            </section>
          </div>

          {/* Right Column - Stats and Info */}
          <div className="space-y-6">
            {/* Learning Streak */}
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <LearningStreak
                currentStreak={streak.currentStreak}
                longestStreak={streak.longestStreak}
              />
            </div>

            {/* Quick Stats */}
            <div className="animate-slide-up rounded-2xl bg-slate-800 border border-slate-700 p-6" style={{ animationDelay: '300ms' }}>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Points</span>
                  <span className="text-lg font-bold text-sky-400">
                    {profile.readinessScore + profile.citizenshipScore + profile.selfManagementScore}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Year of Study</span>
                  <span className="text-lg font-bold text-gray-200">{profile.yearOfStudy}</span>
                </div>
              </div>
            </div>

            {/* Interest Tags */}
            <div className="animate-slide-up rounded-2xl bg-slate-800 border border-slate-700 p-6" style={{ animationDelay: '400ms' }}>
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Your Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition-colors cursor-pointer"
                  >
                    {interest}
                  </span>
                ))}
                {profile.interests.length === 0 && (
                    <span className="text-gray-500 text-sm">No interests listed.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
