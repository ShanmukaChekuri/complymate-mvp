import { Card } from '@tremor/react';
import { Link } from 'react-router-dom';
import type { QuickAction } from '../../types/dashboard';

interface QuickActionCardProps {
  action: QuickAction;
}

const colorClasses = {
  primary: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  success: 'bg-green-50 text-green-700 hover:bg-green-100',
  warning: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
  info: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
};

export function QuickActionCard({ action }: QuickActionCardProps) {
  return (
    <Link to={action.link}>
      <Card className={`p-4 transition-colors ${colorClasses[action.color]}`}>
        <div className="flex items-center space-x-4">
          <div className="text-2xl">{action.icon}</div>
          <div>
            <h3 className="font-medium">{action.title}</h3>
            <p className="text-sm opacity-80">{action.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
} 