import { Card } from '@tremor/react';
import { formatDistanceToNow } from 'date-fns';
import type { RecentActivity } from '../../types/dashboard';

interface ActivityCardProps {
  activity: RecentActivity;
}

const statusColors = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const activityIcons = {
  form_submitted: '📝',
  form_updated: '✏️',
  compliance_check: '✅',
  ai_chat: '🤖',
};

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <Card className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        <div className="text-2xl">{activityIcons[activity.type]}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-500">{activity.description}</p>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[activity.status]}`}>
              {activity.status}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
} 