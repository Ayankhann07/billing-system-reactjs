import React, { useState } from 'react';
import { Search, Calendar, Printer } from 'lucide-react';
import '../styles/purchase.css';

interface PurchaseReturn {
  id: number;
  date: string;
  supplier: string;
  amount: number;
  status: string;
}

const ViewPurchaseReturn = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentMonth] = useState(new Date().toLocaleString('default', { month: 'short', year: 'numeric' }));

  // Mock data - replace with actual data in production
  const [returns] = useState<PurchaseReturn[]>([
    {
      id: 1,
      date: '2025-01-15',
      supplier: 'Supplier A',
      amount: 5000,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2025-01-20',
      supplier: 'Supplier B',
      amount: 7500,
      status: 'Pending'
    }
  ]);

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching between:', fromDate, 'and', toDate);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="purchase-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="purchase-title">View/Update Purchase Return</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="form-group mb-0">
              <label className="form-label">From:</label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-input pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="form-group mb-0">
              <label className="form-label">To:</label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="form-input pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handlePrint}
            className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-center">
            Purchase Return for {currentMonth}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {returns.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    ₹{item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'Completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPurchaseReturn;