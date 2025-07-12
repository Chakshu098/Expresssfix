import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple';
}

function StatsCard({ title, value, description, icon, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg bg-gray-50 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default StatsCard;