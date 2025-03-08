import React, { useState } from 'react';
import { RotateCcw, Plus, Trash2 } from 'lucide-react';
import '../styles/purchase.css';

interface ReturnItem {
  id: number;
  itemCode: string;
  item: string;
  mrp: number;
  discountPercent: number;
  discountAmount: number;
  gstPercent: number;
  gstAmount: number;
  netRate: number;
  qty: number;
  total: number;
}

interface ReturnDetails {
  supplier: string;
  contactNo: string;
  address: string;
  againstInvoice: string;
  returnDate: string;
  isGst: boolean;
  returnTotal: number;
  gstTotal: number;
  total: number;
  cash: number;
  fromBalance: number;
}

const PurchaseReturn: React.FC = () => {
  const [returnDetails, setReturnDetails] = useState<ReturnDetails>({
    supplier: '',
    contactNo: '',
    address: '',
    againstInvoice: '',
    returnDate: new Date().toISOString().split('T')[0],
    isGst: true,
    returnTotal: 0,
    gstTotal: 0,
    total: 0,
    cash: 0,
    fromBalance: 0
  });

  const [items, setItems] = useState<ReturnItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<ReturnItem>>({
    itemCode: '',
    item: '',
    mrp: 0,
    discountPercent: 0,
    gstPercent: 0,
    qty: 1
  });

  const calculateItemValues = (item: Partial<ReturnItem>) => {
    const mrp = Number(item.mrp) || 0;
    const qty = Number(item.qty) || 0;
    const discountPercent = Number(item.discountPercent) || 0;
    const gstPercent = Number(item.gstPercent) || 0;

    const subtotal = mrp * qty;
    const discountAmount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const gstAmount = (afterDiscount * gstPercent) / 100;
    const netRate = (afterDiscount + gstAmount) / qty;
    const total = afterDiscount + gstAmount;

    return {
      ...item,
      discountAmount,
      gstAmount,
      netRate,
      total
    };
  };

  const addItem = () => {
    if (!newItem.itemCode || !newItem.item) {
      alert('Please fill in all required fields');
      return;
    }

    const calculatedItem = calculateItemValues(newItem);
    const newItems = [...items, { ...calculatedItem, id: Date.now() } as ReturnItem];
    setItems(newItems);
    updateTotals(newItems);

    setNewItem({
      itemCode: '',
      item: '',
      mrp: 0,
      discountPercent: 0,
      gstPercent: 0,
      qty: 1
    });
  };

  const removeItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    updateTotals(updatedItems);
  };

  const updateTotals = (currentItems: ReturnItem[]) => {
    const returnTotal = currentItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const gstTotal = currentItems.reduce((sum, item) => sum + (item.gstAmount || 0), 0);
    
    setReturnDetails(prev => ({
      ...prev,
      returnTotal,
      gstTotal,
      total: returnTotal,
      fromBalance: returnTotal - prev.cash
    }));
  };

  const handleSave = () => {
    if (!returnDetails.supplier || !returnDetails.againstInvoice) {
      alert('Please fill in all required fields');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    console.log({ returnDetails, items });
  };

  return (
    <div className="purchase-container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="purchase-title">Purchase Return</h2>
        <div className="form-group">
          <label className="form-label">Against Invoice:</label>
          <input
            type="text"
            value={returnDetails.againstInvoice}
            onChange={(e) => setReturnDetails({ ...returnDetails, againstInvoice: e.target.value })}
            className="form-input"
          />
        </div>
      </div>

     

      {/* Items Section */}
      <div className="items-section">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Item Code</label>
            <input
              type="text"
              value={newItem.itemCode}
              onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
              className="form-input"
            />
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
            <label className="form-label">MRP</label>
            <input
              type="number"
              value={newItem.mrp || ''}
              onChange={(e) => setNewItem({
                ...newItem,
                mrp: parseFloat(e.target.value),
                ...calculateItemValues({ ...newItem, mrp: parseFloat(e.target.value) })
              })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Qty</label>
            <input
              type="number"
              value={newItem.qty || ''}
              onChange={(e) => setNewItem({
                ...newItem,
                qty: parseFloat(e.target.value),
                ...calculateItemValues({ ...newItem, qty: parseFloat(e.target.value) })
              })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Disc(%)</label>
            <input
              type="number"
              value={newItem.discountPercent || ''}
              onChange={(e) => setNewItem({
                ...newItem,
                discountPercent: parseFloat(e.target.value),
                ...calculateItemValues({ ...newItem, discountPercent: parseFloat(e.target.value) })
              })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">GST(%)</label>
            <input
              type="number"
              value={newItem.gstPercent || ''}
              onChange={(e) => setNewItem({
                ...newItem,
                gstPercent: parseFloat(e.target.value),
                ...calculateItemValues({ ...newItem, gstPercent: parseFloat(e.target.value) })
              })}
              className="form-input"
            />
          </div>
          <div className="flex items-end">
            <button onClick={addItem} className="add-item-btn">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item</th>
              <th>MRP</th>
              <th>Disc(%)</th>
              <th>GST(%)</th>
              <th>Net Rate</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.itemCode}</td>
                <td>{item.item}</td>
                <td>₹{item.mrp.toFixed(2)}</td>
                <td>{item.discountPercent}%</td>
                <td>{item.gstPercent}%</td>
                <td>₹{item.netRate.toFixed(2)}</td>
                <td>{item.qty}</td>
                <td>₹{item.total.toFixed(2)}</td>
                <td>
                  <button onClick={() => removeItem(item.id)} className="delete-btn">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="payment-section">
        <div className="payment-details">
          <h3 className="section-title">Amount Summary</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Return Total</label>
              <input
                type="number"
                value={returnDetails.returnTotal}
                readOnly
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">GST Total</label>
              <input
                type="number"
                value={returnDetails.gstTotal}
                readOnly
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total</label>
              <input
                type="number"
                value={returnDetails.total}
                readOnly
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="payment-methods">
          <h3 className="section-title">Mode of Payment</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cash (Rs.)</label>
              <input
                type="number"
                value={returnDetails.cash}
                onChange={(e) => setReturnDetails({
                  ...returnDetails,
                  cash: parseFloat(e.target.value) || 0,
                  fromBalance: returnDetails.total - (parseFloat(e.target.value) || 0)
                })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">From Balance</label>
              <input
                type="number"
                value={returnDetails.fromBalance}
                readOnly
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={returnDetails.isGst}
              onChange={() => setReturnDetails({ ...returnDetails, isGst: true })}
              className="form-radio"
            />
            <span className="ml-2">GST</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={!returnDetails.isGst}
              onChange={() => setReturnDetails({ ...returnDetails, isGst: false })}
              className="form-radio"
            />
            <span className="ml-2">IGST</span>
          </label>
        </div>
        <button onClick={handleSave} className="save-btn">
          <RotateCcw className="w-4 h-4" />
          Return
        </button>
      </div>
    </div>
  );
};

export default PurchaseReturn;