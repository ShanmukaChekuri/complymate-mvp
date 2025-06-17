import { Card } from '@tremor/react';

interface StatCardProps {
  title: string;
  value: number;
  description?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export function StatCard({ title, value, description, icon, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-blue-50 text-blue-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    error: 'bg-red-50 text-red-700',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
} 