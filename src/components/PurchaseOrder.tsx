import React, { useState } from 'react';
import { Plus, Save, FileText } from 'lucide-react';
import '../styles/purchase.css';

interface OrderItem {
  id: number;
  company: string;
  item: string;
  qty: number;
}

const PurchaseOrder = () => {
  const [orderNo, setOrderNo] = useState(1);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [newItem, setNewItem] = useState({
    company: '',
    item: '',
    qty: 1
  });
  const [supplier, setSupplier] = useState('');
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [remark, setRemark] = useState('');

  const handleAddItem = () => {
    if (!newItem.company || !newItem.item || !newItem.qty) {
      alert('Please fill in all required fields');
      return;
    }

    setItems([
      ...items,
      {
        id: Date.now(),
        ...newItem
      }
    ]);

    setNewItem({
      company: '',
      item: '',
      qty: 1
    });
  };

  const handleSave = () => {
    if (!supplier || items.length === 0) {
      alert('Please fill in all required fields and add at least one item');
      return;
    }
    
    console.log({
      orderNo,
      supplier,
      orderDate,
      remark,
      items
    });
  };

  const handleNew = () => {
    setItems([]);
    setSupplier('');
    setRemark('');
    setOrderNo(prev => prev + 1);
  };

  return (
    <div className="purchase-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="purchase-title">New Purchase Order</h2>
        <div className="text-lg font-semibold form-label">
          Order No.: <span className="text-white-600">{orderNo}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company</label>
              <select
                value={newItem.company}
                onChange={(e) => setNewItem({ ...newItem, company: e.target.value })}
                className="form-input"
              >
                <option value="">-select-</option>
                <option value="company1">BizNweb</option>
                <option value="company2">Company 2</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Item</label>
              <input
                type="text"
                value={newItem.item}
                onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Qty</label>
              <input
                type="number"
                value={newItem.qty}
                onChange={(e) => setNewItem({ ...newItem, qty: parseInt(e.target.value) })}
                className="form-input"
                min="1"
              />
            </div>
            <div className="form-group flex items-end">
              <button onClick={handleAddItem} className="add-btn">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              Show short items
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Sr.</th>
                    <th className="px-4 py-2">Company</th>
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.company}</td>
                      <td className="px-4 py-2">{item.item}</td>
                      <td className="px-4 py-2">{item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Select Supplier</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Order date</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Remark</label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-6">
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Sr.</th>
                    <th className="px-4 py-2">Company</th>
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{item.company}</td>
                      <td className="px-4 py-2">{item.item}</td>
                      <td className="px-4 py-2">{item.qty}</td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                        Purchase Order Items
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleSave}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
        <button
          onClick={handleNew}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          New
        </button>
      </div>
    </div>
  );
};

export default PurchaseOrder;