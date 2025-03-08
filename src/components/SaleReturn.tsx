import React, { useState } from 'react';
import { Calendar, Plus, Save } from 'lucide-react';
import '../styles/saleReturn.css';

interface ReturnItem {
  id: number;
  itemCode: string;
  item: string;
  rate: number;
  discountPercent: number;
  discountAmount: number;
  gstPercent: number;
  gstAmount: number;
  netRate: number;
  qty: number;
  total: number;
}

const SaleReturn = () => {
  const [serialNo] = useState(1);
  const [againstInvoice, setAgainstInvoice] = useState('');
  const [customer, setCustomer] = useState({
    name: '',
    contactNo: '',
    address: '',
  });

  const [items, setItems] = useState<ReturnItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<ReturnItem>>({
    itemCode: '',
    item: '',
    rate: 0,
    discountPercent: 0,
    gstPercent: 0,
    qty: 1,
  });

  const [paymentDetails, setPaymentDetails] = useState({
    returnTotal: 0,
    gstTotal: 0,
    total: 0,
    cash: 0,
    fromBalance: 0,
    returnDate: new Date().toISOString().split('T')[0],
    isGst: true,
  });

  const calculateItemValues = (item: Partial<ReturnItem>) => {
    const rate = Number(item.rate) || 0;
    const qty = Number(item.qty) || 0;
    const discountPercent = Number(item.discountPercent) || 0;
    const gstPercent = Number(item.gstPercent) || 0;

    const subtotal = rate * qty;
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
      total,
    };
  };

  const handleAddItem = () => {
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
      rate: 0,
      discountPercent: 0,
      gstPercent: 0,
      qty: 1,
    });
  };

  const updateTotals = (currentItems: ReturnItem[]) => {
    const returnTotal = currentItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const gstTotal = currentItems.reduce((sum, item) => sum + (item.gstAmount || 0), 0);
    
    setPaymentDetails(prev => ({
      ...prev,
      returnTotal,
      gstTotal,
      total: returnTotal,
      fromBalance: returnTotal - prev.cash
    }));
  };

  const handleReturn = () => {
    if (!customer.name || !againstInvoice) {
      alert('Please fill in all required fields');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    console.log({
      serialNo,
      againstInvoice,
      customer,
      items,
      paymentDetails,
    });
  };

  return (
    <div className="sale-return-container">
      <div className="header">
        <div className="title-section">
          <h2>SALE RETURN</h2>
          <span className="serial-no">Sr. : {serialNo}</span>
        </div>
        <div className="invoice-section">
          <label>Against Invoice:</label>
          <input
            type="text"
            value={againstInvoice}
            onChange={(e) => setAgainstInvoice(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="customer-section">
        <div className="form-row">
          <div className="form-group">
            <label>Customer</label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Contact No. (10-digit only)</label>
            <input
              type="text"
              value={customer.contactNo}
              onChange={(e) => setCustomer({ ...customer, contactNo: e.target.value })}
              className="form-input"
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <div className="items-section">
        <div className="form-row">
          <div className="form-group">
            <label>Item Code</label>
            <input
              type="text"
              value={newItem.itemCode}
              onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Item</label>
            <input
              type="text"
              value={newItem.item}
              onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Rate</label>
            <input
              type="number"
              value={newItem.rate || ''}
              onChange={(e) => setNewItem({
                ...newItem,
                rate: parseFloat(e.target.value),
                ...calculateItemValues({ ...newItem, rate: parseFloat(e.target.value) })
              })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Dis(%)</label>
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
            <label>GST(%)</label>
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
          <div className="form-group">
            <label>Qty</label>
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
            <button onClick={handleAddItem} className="add-btn">
              <Plus className="icon" />
              ADD
            </button>
          </div>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item</th>
              <th>Rate</th>
              <th>Dis(%)</th>
              <th>Dis(Rs.)</th>
              <th>GST(%)</th>
              <th>GST(Rs)</th>
              <th>Net Rate</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.itemCode}</td>
                <td>{item.item}</td>
                <td>₹{item.rate}</td>
                <td>{item.discountPercent}%</td>
                <td>₹{item.discountAmount.toFixed(2)}</td>
                <td>{item.gstPercent}%</td>
                <td>₹{item.gstAmount.toFixed(2)}</td>
                <td>₹{item.netRate.toFixed(2)}</td>
                <td>{item.qty}</td>
                <td>₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="amount-summary">
        <div className="summary-details">
          <div className="summary-row">
            <label>Return Total</label>
            <input
              type="number"
              value={paymentDetails.returnTotal}
              readOnly
              className="form-input readonly"
            />
          </div>
          <div className="summary-row">
            <label>GST Total(Rs.)</label>
            <input
              type="number"
              value={paymentDetails.gstTotal}
              readOnly
              className="form-input readonly"
            />
          </div>
          <div className="summary-row">
            <label>Total</label>
            <input
              type="number"
              value={paymentDetails.total}
              readOnly
              className="form-input readonly"
            />
          </div>
          <div className="summary-row">
            <label>Cash (Rs.)</label>
            <input
              type="number"
              value={paymentDetails.cash}
              onChange={(e) => setPaymentDetails({
                ...paymentDetails,
                cash: parseFloat(e.target.value) || 0,
                fromBalance: paymentDetails.total - (parseFloat(e.target.value) || 0)
              })}
              className="form-input"
            />
          </div>
          <div className="summary-row">
            <label>From Balance(Rs.)</label>
            <input
              type="number"
              value={paymentDetails.fromBalance}
              readOnly
              className="form-input readonly"
            />
          </div>
        </div>

        <div className="return-actions">
          <div className="date-section">
            <label>Return Date:</label>
            <div className="date-field">
              <input
                type="date"
                value={paymentDetails.returnDate}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  returnDate: e.target.value
                })}
                className="form-input"
              />
              <Calendar className="calendar-icon" />
            </div>
          </div>

          <div className="gst-selection">
            <label>
              <input
                type="radio"
                checked={paymentDetails.isGst}
                onChange={() => setPaymentDetails({ ...paymentDetails, isGst: true })}
              />
              GST
            </label>
            <label>
              <input
                type="radio"
                checked={!paymentDetails.isGst}
                onChange={() => setPaymentDetails({ ...paymentDetails, isGst: false })}
              />
              IGST
            </label>
          </div>

          <button onClick={handleReturn} className="return-btn">
            <Save className="icon" />
            Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleReturn;