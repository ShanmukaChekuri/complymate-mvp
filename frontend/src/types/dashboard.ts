export interface ComplianceStatus {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export interface RecentActivity {
  id: string;
  type: 'form_submitted' | 'form_updated' | 'compliance_check' | 'ai_chat';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  color: 'primary' | 'success' | 'warning' | 'info';
}

export interface DashboardStats {
  complianceStatus: ComplianceStatus;
  recentActivities: RecentActivity[];
  quickActions: QuickAction[];
} 