import { useEffect, useState } from 'react';
import PremiumStatCard from '../components/dashboard/PremiumStatCard';
import HeroUploadCard from '../components/dashboard/HeroUploadCard';
import { getDashboardStats } from '../services/dashboardService';
import type { DashboardStats } from '../types/dashboard';
import {
  CheckCircleIcon,
  DocumentIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';

const gradients = {
  total: 'linear-gradient(120deg, #0052FF 0%, #1E40AF 100%)',
  completed: 'linear-gradient(120deg, #10B981 0%, #059669 100%)',
  pending: 'linear-gradient(120deg, #F59E0B 0%, #D97706 100%)',
  overdue: 'linear-gradient(120deg, #EF4444 0%, #DC2626 100%)',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardStats();
  }, []);

  // Skeleton loading state
  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="text-lg text-red-500">
          Failed to load dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  // Modern icons for stats
  const statIcons = [
    <DocumentIcon className="w-8 h-8 text-white/90" />, // Total
    <CheckCircleIcon className="w-8 h-8 text-white/90" />, // Completed
    <ClockIcon className="w-8 h-8 text-white/90" />, // Pending
    <ExclamationTriangleIcon className="w-8 h-8 text-white/90" />, // Overdue
  ];

  // Example trends and progress (replace with real data if available)
  const trends = [
    { trend: 'up', value: 8 },
    { trend: 'up', value: 3 },
    { trend: 'down', value: 2 },
    { trend: 'up', value: 1 },
  ];
  const progresses = [
    100,
    Math.round((stats.complianceStatus.completed / stats.complianceStatus.total) * 100),
    Math.round((stats.complianceStatus.pending / stats.complianceStatus.total) * 100),
    Math.round((stats.complianceStatus.overdue / stats.complianceStatus.total) * 100),
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl font-bold text-neutral-900 dark:text-white">Dashboard</span>
        <span className="ml-2 text-blue-500">
          <DocumentIcon className="w-7 h-7 inline-block" />
        </span>
      </div>
      <div className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">
        Welcome to your compliance dashboard
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PremiumStatCard
          label="Total Forms"
          value={stats.complianceStatus.total}
          description="All compliance forms"
          icon={statIcons[0]}
          gradient={gradients.total}
          progress={progresses[0]}
          trend={trends[0].trend as 'up' | 'down'}
          trendValue={trends[0].value}
        />
        <PremiumStatCard
          label="Completed"
          value={stats.complianceStatus.completed}
          description="Successfully submitted"
          icon={statIcons[1]}
          gradient={gradients.completed}
          progress={progresses[1]}
          trend={trends[1].trend as 'up' | 'down'}
          trendValue={trends[1].value}
        />
        <PremiumStatCard
          label="Pending"
          value={stats.complianceStatus.pending}
          description="Awaiting completion"
          icon={statIcons[2]}
          gradient={gradients.pending}
          progress={progresses[2]}
          trend={trends[2].trend as 'up' | 'down'}
          trendValue={trends[2].value}
        />
        <PremiumStatCard
          label="Overdue"
          value={stats.complianceStatus.overdue}
          description="Past due date"
          icon={statIcons[3]}
          gradient={gradients.overdue}
          progress={progresses[3]}
          trend={trends[3].trend as 'up' | 'down'}
          trendValue={trends[3].value}
        />
      </div>

      {/* Quick Actions Section */}
      <div className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Quick Actions
          </span>
          <span className="text-blue-500">
            <BoltIcon className="w-6 h-6 inline-block" />
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hero Upload Card */}
          <HeroUploadCard />

          {/* Other Quick Actions */}
          <div className="flex flex-col gap-6 md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {/* Start AI Chat */}
              <div className="rounded-xl bg-gradient-to-br from-blue-500/80 to-blue-700/80 shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform group">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-white animate-pulse group-hover:scale-110 transition-transform" />
                <div className="mt-2 text-white font-semibold">Start AI Chat</div>
                <div className="text-white/80 text-xs mt-1">Get AI assistance with forms</div>
                <div className="mt-2 text-xs text-white/60">⌘+A</div>
              </div>
              {/* Generate Report */}
              <div className="rounded-xl bg-gradient-to-br from-green-500/80 to-green-700/80 shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform group">
                <ChartBarIcon className="w-8 h-8 text-white group-hover:rotate-6 transition-transform" />
                <div className="mt-2 text-white font-semibold">Generate Report</div>
                <div className="text-white/80 text-xs mt-1">Export compliance reports</div>
                <div className="mt-2 text-xs text-white/60">⌘+E</div>
              </div>
              {/* Quick Search */}
              <div className="rounded-xl bg-gradient-to-br from-purple-500/80 to-purple-700/80 shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform group">
                <MagnifyingGlassIcon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                <div className="mt-2 text-white font-semibold">Quick Search</div>
                <div className="text-white/80 text-xs mt-1">Find forms instantly</div>
                <div className="mt-2 text-xs text-white/60">⌘+K</div>
              </div>
              {/* Schedule Review */}
              <div className="rounded-xl bg-gradient-to-br from-orange-500/80 to-orange-700/80 shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform group">
                <CalendarDaysIcon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                <div className="mt-2 text-white font-semibold">Schedule Review</div>
                <div className="text-white/80 text-xs mt-1">Plan compliance review</div>
                <div className="mt-2 text-xs text-white/60">⌘+R</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Section (unchanged for now) */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Recent Activities
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* You can keep your existing ActivityCard here */}
        </div>
      </div>
    </div>
  );
}
