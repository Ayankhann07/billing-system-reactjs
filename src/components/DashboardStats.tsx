import React from 'react';
import { Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';

const stats = [
  {
    name: 'Total Users',
    value: '2,543',
    icon: Users,
    change: '+12.5%',
    changeType: 'increase',
  },
  {
    name: 'Revenue',
    value: '$45,234',
    icon: DollarSign,
    change: '+15.2%',
    changeType: 'increase',
  },
  {
    name: 'Orders',
    value: '1,345',
    icon: ShoppingBag,
    change: '+8.1%',
    changeType: 'increase',
  },
  {
    name: 'Growth',
    value: '23.5%',
    icon: TrendingUp,
    change: '+4.3%',
    changeType: 'increase',
  },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
              <stat.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-200" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4">
            <span
              className={`text-sm font-medium ${
                stat.changeType === 'increase'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400"> from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;