import React from 'react';
import { FileText, Eye, Receipt, ArrowDownToLine, BarChart2, Book, Users, ShoppingBag, FileBarChart } from 'lucide-react';

const shortcuts = [
  { name: 'New Estimate', icon: FileText, color: 'text-orange-600' },
  { name: 'View Estimate', icon: Eye, color: 'text-blue-600' },
  { name: 'Dummy Invoice', icon: Receipt, color: 'text-purple-600' },
  { name: 'New Invoice', icon: FileText, color: 'text-green-600' },
  { name: 'View Invoice', icon: Eye, color: 'text-blue-600' },
  { name: 'Payment', icon: ArrowDownToLine, color: 'text-indigo-600' },
  { name: 'Sale Return', icon: ShoppingBag, color: 'text-red-600' },
  { name: 'BarCode', icon: BarChart2, color: 'text-gray-600' },
  { name: 'New Purchase', icon: ShoppingBag, color: 'text-green-600' },
  { name: 'Available Stock', icon: Book, color: 'text-yellow-600' },
  { name: 'Journal Entries', icon: FileBarChart, color: 'text-blue-600' },
  { name: 'Debtors', icon: Users, color: 'text-purple-600' },
];

const Shortcuts = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shortcuts</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shortcuts.map((shortcut) => (
          <button
            key={shortcut.name}
            className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <shortcut.icon className={`w-6 h-6 ${shortcut.color} dark:text-gray-200 mb-2`} />
            <span className="text-sm text-gray-700 dark:text-gray-200 text-center">{shortcut.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shortcuts;