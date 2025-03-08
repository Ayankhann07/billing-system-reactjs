import React from 'react';

interface SaleData {
  type: string;
  amount: string;
}

const AlertsPanel = () => {
  const salesData: SaleData[] = [
    { type: 'Cash Sale', amount: '12,500' },
    { type: 'Card/UPI', amount: '8,750' },
    { type: 'Cheque Sale', amount: '15,000' },
    { type: 'Credit Sale', amount: '6,250' },
  ];

  const totalSale = salesData.reduce((acc, curr) => acc + parseFloat(curr.amount.replace(/,/g, '')), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Alerts</h2>
      
      {/* Today's Sale */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Today's Sale</h3>
        {salesData.map((sale) => (
          <div key={sale.type} className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{sale.type}(Rs.)</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{sale.amount}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Sale(Rs.)</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {totalSale.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* SMS Balance */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">SMS Balance</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">SMS</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">250</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">GST Liability</span>
            <span className="text-sm font-medium text-blue-600">4229.20</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;