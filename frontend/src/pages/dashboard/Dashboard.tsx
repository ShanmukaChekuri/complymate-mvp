import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      id: 1,
      title: 'Total Forms',
      value: '12',
      change: '+8%',
      trend: 'up',
      description: 'All compliance forms',
      color: 'from-blue-500 to-blue-600',
      icon: '📋'
    },
    {
      id: 2,
      title: 'Completed',
      value: '5',
      change: '+3%',
      trend: 'up', 
      description: 'Successfully submitted',
      color: 'from-emerald-500 to-emerald-600',
      icon: '✅'
    },
    {
      id: 3,
      title: 'Pending',
      value: '4',
      change: '-2%',
      trend: 'down',
      description: 'Awaiting completion',
      color: 'from-amber-500 to-amber-600',
      icon: '⏳'
    },
    {
      id: 4,
      title: 'Overdue',
      value: '3',
      change: '+1%',
      trend: 'up',
      description: 'Past due date',
      color: 'from-red-500 to-red-600',
      icon: '⚠️'
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Start AI Chat',
      description: 'Get AI assistance with forms',
      icon: '🤖',
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/chat'),
      shortcut: '⌘+A'
    },
    {
      id: 2,
      title: 'Create New Form',
      description: 'Start OSHA compliance form',
      icon: '📝',
      color: 'from-emerald-500 to-emerald-600',
      action: () => navigate('/forms'),
      shortcut: '⌘+N'
    },
    {
      id: 3,
      title: 'Generate Report',
      description: 'Export compliance reports',
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
      action: () => console.log('Generate report'),
      shortcut: '⌘+E'
    },
    {
      id: 4,
      title: 'Quick Search',
      description: 'Find forms instantly',
      icon: '🔍',
      color: 'from-orange-500 to-orange-600',
      action: () => console.log('Search'),
      shortcut: '⌘+K'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'OSHA 300 Log Updated',
      description: 'Warehouse incident added to injury log',
      time: '2 hours ago',
      type: 'form',
      icon: '📋'
    },
    {
      id: 2,
      title: 'Safety Training Completed',
      description: 'John Smith completed forklift certification',
      time: '4 hours ago',
      type: 'training',
      icon: '🎓'
    },
    {
      id: 3,
      title: 'Compliance Report Generated',
      description: 'Q4 2024 summary report created',
      time: '1 day ago',
      type: 'report',
      icon: '📊'
    },
    {
      id: 4,
      title: 'New Regulation Alert',
      description: 'OSHA updated chemical safety guidelines',
      time: '2 days ago',
      type: 'alert',
      icon: '⚖️'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-xl`}>
                  {stat.icon}
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  stat.trend === 'up' 
                    ? 'bg-emerald-900/30 text-emerald-400' 
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="font-medium text-slate-300">{stat.title}</div>
                <div className="text-sm text-slate-500">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            ⚡ Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-left hover:scale-105 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center text-lg`}>
                    {action.icon}
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
                    {action.shortcut}
                  </span>
                </div>
                <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                  {action.title}
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  {action.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            📈 Recent Activities
          </h3>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl divide-y divide-slate-700">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-lg flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{activity.title}</div>
                    <div className="text-sm text-slate-400 mt-1">{activity.description}</div>
                  </div>
                  <div className="text-xs text-slate-500 flex-shrink-0">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 