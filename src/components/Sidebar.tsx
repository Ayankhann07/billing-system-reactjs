import React, { useState } from 'react';
import { X, Home, ShoppingBag, BarChart2, Settings, Users, FileText, Database, Cog, ChevronDown, ChevronRight, UserPlus, Eye, FileDown, ClipboardList, ArrowDownLeft, Receipt, RotateCcw, Building } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNavigate: (view: string) => void;
}

interface NavItem {
  name: string;
  icon: React.ElementType;
  current?: boolean;
  subItems?: { name: string; icon: React.ElementType; view?: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onNavigate }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const navigation: NavItem[] = [
    { name: 'Home', icon: Home, current: true },
    { 
      name: 'Purchases', 
      icon: ShoppingBag,
      subItems: [
        { name: 'Add Purchase', icon: ShoppingBag, view: 'addPurchase' },
        { name: 'Purchase Return', icon: ArrowDownLeft, view: 'purchaseReturn' },
        { name: 'View Purchase Return', icon: Eye, view: 'viewPurchaseReturn' },
        { name: 'Add Supplier', icon: UserPlus, view: 'addSupplier' },
        { name: 'View Purchases', icon: Eye, view: 'viewPurchases' },
        { name: 'Purchase Order', icon: ClipboardList, view: 'purchaseOrder' },
        { name: 'View Purchase Order', icon: FileDown, view: 'viewPurchaseOrder' },
      ]
    },
    { 
      name: 'Sales', 
      icon: BarChart2,
      subItems: [
        { name: 'New Invoice', icon: Receipt, view: 'newInvoice' },
        { name: 'View Invoice', icon: Eye, view: 'viewInvoice' },
        { name: 'View Estimate', icon: FileText, view: 'viewEstimate' },
        { name: 'Sales Return', icon: RotateCcw, view: 'salesReturn' },
      ]
    },
    { name: 'Quotation', icon: FileText },
    { name: 'ORDER', icon: ShoppingBag },
    { name: 'Stock', icon: Database },
    { name: 'GL', icon: FileText },
    { name: 'Customers', icon: Users },
    { name: 'Configuration', icon: Cog,
      subItems: [
        { name: 'Config', icon: Building, view: 'config' },
       ]
     },
  ];

  const handleItemClick = (itemName: string) => {
    if (itemName === 'Home') {
      onNavigate('dashboard');
      setIsOpen(false);
      return;
    }
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  const handleSubItemClick = (view?: string) => {
    if (view) {
      onNavigate(view);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform lg:transform-none lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <button
            className="p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-200" />
          </button>
        </div>
        <nav className="mt-4">
          {navigation.map((item) => (
            <div key={item.name}>
              <button
                onClick={() => handleItemClick(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium ${
                  item.current
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
                {item.subItems && (
                  expandedItem === item.name 
                    ? <ChevronDown className="w-4 h-4" />
                    : <ChevronRight className="w-4 h-4" />
                )}
              </button>
              {item.subItems && expandedItem === item.name && (
                <div className="bg-gray-50 dark:bg-gray-700">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.name}
                      onClick={() => handleSubItemClick(subItem.view)}
                      className="w-full flex items-center pl-12 pr-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <subItem.icon className="w-4 h-4 mr-3" />
                      {subItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;