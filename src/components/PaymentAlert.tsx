import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Filter, Download, Calendar } from 'lucide-react';

interface Payment {
  date: string;
  amount: number;
  status: 'pending' | 'overdue';
  customer: string;
}

const paymentData: Payment[] = [
  { date: '2024-01-01', amount: 5000, status: 'overdue', customer: 'Customer A' },
  { date: '2024-01-15', amount: 7500, status: 'pending', customer: 'Customer B' },
  { date: '2024-02-01', amount: 3000, status: 'overdue', customer: 'Customer C' },
  { date: '2024-02-15', amount: 6000, status: 'pending', customer: 'Customer D' },
  { date: '2024-02-28', amount: 4500, status: 'pending', customer: 'Customer E' },
];

const chartData = paymentData.reduce((acc: any[], payment) => {
  const date = new Date(payment.date);
  const month = date.toLocaleString('default', { month: 'short' });
  const existing = acc.find(item => item.month === month);
  
  if (existing) {
    existing.amount += payment.amount;
    existing[payment.status] += payment.amount;
  } else {
    acc.push({
      month,
      amount: payment.amount,
      pending: payment.status === 'pending' ? payment.amount : 0,
      overdue: payment.status === 'overdue' ? payment.amount : 0,
    });
  }
  
  return acc;
}, []);

const PaymentAlert = () => {
  const [viewType, setViewType] = useState<'chart' | 'table'>('chart');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'overdue'>('all');

  const filteredData = paymentData.filter(payment => 
    filterStatus === 'all' ? true : payment.status === filterStatus
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Payment Alert for Last 2 months
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'overdue')}
              className="text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewType(viewType === 'chart' ? 'table' : 'chart')}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
            >
              {viewType === 'chart' ? 'View Table' : 'View Chart'}
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {viewType === 'chart' ? (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pending" stroke="#4f46e5" name="Pending" />
              <Line type="monotone" dataKey="overdue" stroke="#ef4444" name="Overdue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((payment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {payment.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    ₹{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'overdue' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentAlert;