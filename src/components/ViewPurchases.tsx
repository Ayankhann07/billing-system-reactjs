import React, { useState } from 'react';
import { Search, Calendar, Printer } from 'lucide-react';
import '../styles/purchase.css';

interface Purchase {
  id: number;
  date: string;
  supplier: string;
  item: string;
  quantity: number;
  amount: number;
  type: 'GST' | 'IGST' | 'Bill' | 'Estimate';
}

const ViewPurchases = () => {
  const [itemSearch, setItemSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [purchaseType, setPurchaseType] = useState<'all' | 'gst' | 'bill' | 'estimate'>('all');
  const [currentMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));

  // Mock data - replace with actual data in production
  const [purchases] = useState<Purchase[]>([
    {
      id: 1,
      date: '2025-01-15',
      supplier: 'Supplier A',
      item: 'Item 1',
      quantity: 10,
      amount: 5000,
      type: 'GST'
    },
    {
      id: 2,
      date: '2025-01-20',
      supplier: 'Supplier B',
      item: 'Item 2',
      quantity: 5,
      amount: 7500,
      type: 'Bill'
    }
  ]);

  const suppliers = ['All', 'bizNweb', 'Supplier A', 'Supplier B'];

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching:', {
      item: itemSearch,
      supplier: selectedSupplier,
      fromDate,
      toDate,
      type: purchaseType
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredPurchases = purchases.filter(purchase => {
    if (itemSearch && !purchase.item.toLowerCase().includes(itemSearch.toLowerCase())) {
      return false;
    }
    if (selectedSupplier !== 'All' && purchase.supplier !== selectedSupplier) {
      return false;
    }
    if (fromDate && new Date(purchase.date) < new Date(fromDate)) {
      return false;
    }
    if (toDate && new Date(purchase.date) > new Date(toDate)) {
      return false;
    }
    if (purchaseType !== 'all') {
      if (purchaseType === 'gst' && purchase.type !== 'GST' && purchase.type !== 'IGST') {
        return false;
      }
      if (purchaseType === 'bill' && purchase.type !== 'Bill') {
        return false;
      }
      if (purchaseType === 'estimate' && purchase.type !== 'Estimate') {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="purchase-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="purchase-title">Supplier Items</h2>
        <button
          onClick={handlePrint}
          className="bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700"
        >
          <Printer className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="form-group">
          <label className="form-label">Item:</label>
          <input
            type="text"
            value={itemSearch}
            onChange={(e) => setItemSearch(e.target.value)}
            className="form-input"
            placeholder="Search items..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Supplier</label>
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="form-input"
          >
            {suppliers.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">From:</label>
          <div className="relative">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-input pr-8 "
            />
            {/* <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">To:</label>
          <div className="relative">
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-input pr-8"
            />
            {/* <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </button>

        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={purchaseType === 'all'}
              onChange={() => setPurchaseType('all')}
              className="form-radio"
            />
            <span className="ml-2 form-label">All</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={purchaseType === 'gst'}
              onChange={() => setPurchaseType('gst')}
              className="form-radio"
            />
            <span className="ml-2 form-label">GST</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={purchaseType === 'bill'}
              onChange={() => setPurchaseType('bill')}
              className="form-radio"
            />
            <span className="ml-2 form-label">Bill</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={purchaseType === 'estimate'}
              onChange={() => setPurchaseType('estimate')}
              className="form-radio"
            />
            <span className="ml-2 form-label">Estimate</span>
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-center form-label">
            Purchases for {currentMonth}
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
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {new Date(purchase.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {purchase.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {purchase.item}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {purchase.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    ₹{purchase.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      purchase.type === 'GST' || purchase.type === 'IGST'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : purchase.type === 'Bill'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {purchase.type}
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

export default ViewPurchases;