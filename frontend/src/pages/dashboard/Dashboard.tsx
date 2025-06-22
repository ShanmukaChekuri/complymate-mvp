import React from 'react';

export const Dashboard: React.FC = () => {
  const stats = [
    {
      id: 1,
      title: 'Active Forms',
      value: '12',
      change: '+2.1%',
      trend: 'up',
      icon: (
        <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Compliance Score',
      value: '94%',
      change: '+5.2%',
      trend: 'up',
      icon: (
        <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Tasks Completed',
      value: '247',
      change: '+12.5%',
      trend: 'up',
      icon: (
        <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22,4 12,14.01 9,11.01"/>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Team Members',
      value: '8',
      change: '0%',
      trend: 'neutral',
      icon: (
        <svg className="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      )
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Create New Form',
      description: 'Start a new compliance form',
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      ),
      action: 'create'
    },
    {
      id: 2,
      title: 'Chat with AI',
      description: 'Get compliance assistance',
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      action: 'chat'
    },
    {
      id: 3,
      title: 'Upload Document',
      description: 'Scan and process files',
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <polyline points="9,15 12,12 15,15"/>
        </svg>
      ),
      action: 'upload'
    },
    {
      id: 4,
      title: 'View Reports',
      description: 'Check compliance status',
      icon: (
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"/>
          <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
        </svg>
      ),
      action: 'reports'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Form completed',
      item: 'OSHA 300 Injury Log',
      user: 'Sarah Johnson',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      action: 'Document uploaded',
      item: 'Safety Training Certificate',
      user: 'Mike Chen',
      time: '4 hours ago',
      status: 'uploaded'
    },
    {
      id: 3,
      action: 'Form drafted',
      item: 'Emergency Response Plan',
      user: 'Emily Davis',
      time: '6 hours ago',
      status: 'draft'
    },
    {
      id: 4,
      action: 'Review completed',
      item: 'Workplace Safety Audit',
      user: 'David Wilson',
      time: '1 day ago',
      status: 'reviewed'
    }
  ];

  const getActivityIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        );
      case 'uploaded':
        return (
          <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        );
      case 'draft':
        return (
          <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        );
      case 'reviewed':
        return (
          <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'uploaded':
        return 'text-blue-600';
      case 'draft':
        return 'text-yellow-600';
      case 'reviewed':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="welcome-section">
            <h1 className="text-heading-2">Welcome back, Sarah! 👋</h1>
            <p className="text-body text-secondary">Here's your compliance overview for today</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Export Report
            </button>
            <button className="btn-primary">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Form
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card glass-card animate-fade-in">
              <div className="stat-card-header">
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className={`stat-trend ${stat.trend === 'up' ? 'trend-up' : stat.trend === 'down' ? 'trend-down' : 'trend-neutral'}`}>
                  {stat.trend === 'up' && (
                    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
                      <polyline points="17,6 23,6 23,12"/>
                    </svg>
                  )}
                  {stat.trend === 'down' && (
                    <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/>
                      <polyline points="17,18 23,18 23,12"/>
                    </svg>
                  )}
                  <span className="text-caption">{stat.change}</span>
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value text-heading-1">{stat.value}</div>
                <div className="stat-label text-body-small text-secondary">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <div className="section-header">
            <h2 className="text-heading-3">Quick Actions</h2>
            <p className="text-body-small text-secondary">Get started with common tasks</p>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <button key={action.id} className="quick-action-card glass-card-flat">
                <div className="action-icon">
                  {action.icon}
                </div>
                <div className="action-content">
                  <h3 className="action-title text-heading-4">{action.title}</h3>
                  <p className="action-description text-body-small text-secondary">{action.description}</p>
                </div>
                <div className="action-arrow">
                  <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7"/>
                    <polyline points="7,7 17,7 17,17"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity-section">
          <div className="section-header">
            <h2 className="text-heading-3">Recent Activity</h2>
            <button className="btn-ghost">
              <span>View all</span>
              <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
          </div>
          <div className="activity-list glass-card">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className={`activity-item ${index !== recentActivity.length - 1 ? 'border-bottom' : ''}`}>
                <div className={`activity-icon ${getActivityStatusColor(activity.status)}`}>
                  {getActivityIcon(activity.status)}
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    <span className="activity-action text-body">{activity.action}</span>
                    <span className="activity-item-name text-body font-medium">{activity.item}</span>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-user text-caption">{activity.user}</span>
                    <span className="activity-time text-caption">{activity.time}</span>
                  </div>
                </div>
                <div className="activity-status">
                  <span className={`status-badge ${activity.status}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 