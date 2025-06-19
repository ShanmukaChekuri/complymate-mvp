import type { DashboardStats, ComplianceStatus, RecentActivity, QuickAction } from '../types/dashboard';

// Mock data for MVP
const mockComplianceStatus: ComplianceStatus = {
  total: 12,
  completed: 5,
  pending: 4,
  overdue: 3,
};

const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'form_submitted',
    title: 'Annual Compliance Report',
    description: 'Submitted by John Doe',
    timestamp: new Date(),
    status: 'success',
  },
  {
    id: '2',
    type: 'compliance_check',
    title: 'Security Audit',
    description: 'New requirements added',
    timestamp: new Date(Date.now() - 3600000),
    status: 'warning',
  },
  {
    id: '3',
    type: 'ai_chat',
    title: 'Compliance Query',
    description: 'Asked about GDPR requirements',
    timestamp: new Date(Date.now() - 7200000),
    status: 'info',
  },
];

const mockQuickActions: QuickAction[] = [
  {
    id: '1',
    title: 'New Form',
    description: 'Create a new compliance form',
    icon: 'document-plus',
    link: '/forms/new',
    color: 'primary',
  },
  {
    id: '2',
    title: 'Compliance Check',
    description: 'Run a compliance check',
    icon: 'shield-check',
    link: '/compliance/check',
    color: 'success',
  },
  {
    id: '3',
    title: 'Ask AI',
    description: 'Get help from AI assistant',
    icon: 'chat-bubble-left-right',
    link: '/chat',
    color: 'info',
  },
];

export async function getDashboardStats(): Promise<DashboardStats> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    complianceStatus: mockComplianceStatus,
    recentActivities: mockRecentActivities,
    quickActions: mockQuickActions,
  };
} 