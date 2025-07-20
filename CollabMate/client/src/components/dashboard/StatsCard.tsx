import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'indigo' | 'purple' | 'green';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-800 border-indigo-100',
    purple: 'bg-purple-50 text-purple-800 border-purple-100',
    green: 'bg-green-50 text-green-800 border-green-100'
  };

  const iconColorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6 border transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${iconColorClasses[color]} rounded-full p-3`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};