import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Filter, Download } from 'lucide-react';

interface StockItem {
  name: string;
  currentStock: number;
  minRequired: number;
}

const stockData: StockItem[] = [
  { name: 'Product A', currentStock: 15, minRequired: 20 },
  { name: 'Product B', currentStock: 8, minRequired: 25 },
  { name: 'Product C', currentStock: 5, minRequired: 15 },
  { name: 'Product D', currentStock: 12, minRequired: 30 },
  { name: 'Product E', currentStock: 3, minRequired: 10 },
];

const StockAlert = () => {
  const [filterValue, setFilterValue] = useState<number>(5);
  const [viewType, setViewType] = useState<'chart' | 'table'>('chart');

  const filteredData = stockData.filter(item => item.currentStock <= filterValue);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Stock Alert</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(Number(e.target.value))}
              className="text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="5">Below 5</option>
              <option value="10">Below 10</option>
              <option value="20">Below 20</option>
              <option value="30">Below 30</option>
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
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentStock" fill="#4f46e5" name="Current Stock" />
              <Bar dataKey="minRequired" fill="#ef4444" name="Min Required" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Min Required
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((item) => (
                <tr key={item.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {item.currentStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {item.minRequired}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Low Stock
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

export default StockAlert;