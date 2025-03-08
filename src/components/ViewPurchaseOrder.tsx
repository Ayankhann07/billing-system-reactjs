import React, { useState } from 'react';
import { Search, Calendar, Printer } from 'lucide-react';
import '../styles/viewPurchaseOrder.css';

interface PurchaseOrder {
  id: number;
  orderDate: string;
  supplier: string;
  items: {
    id: number;
    company: string;
    item: string;
    quantity: number;
  }[];
  status: 'Pending' | 'Completed' | 'Cancelled';
}

const ViewPurchaseOrder = () => {
  const [selectedSupplier, setSelectedSupplier] = useState('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));

  // Mock data - replace with actual data in production
  const [orders] = useState<PurchaseOrder[]>([
    {
      id: 1,
      orderDate: '2025-01-15',
      supplier: 'Supplier A',
      items: [
        { id: 1, company: 'Company X', item: 'Item 1', quantity: 10 },
        { id: 2, company: 'Company Y', item: 'Item 2', quantity: 5 }
      ],
      status: 'Pending'
    },
    {
      id: 2,
      orderDate: '2025-01-20',
      supplier: 'Supplier B',
      items: [
        { id: 3, company: 'Company Z', item: 'Item 3', quantity: 15 }
      ],
      status: 'Completed'
    }
  ]);

  const suppliers = ['ALL', 'Supplier A', 'Supplier B', 'Supplier C'];

  const handleSearch = () => {
    console.log('Searching:', {
      supplier: selectedSupplier,
      fromDate,
      toDate
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredOrders = orders.filter(order => {
    if (selectedSupplier !== 'ALL' && order.supplier !== selectedSupplier) {
      return false;
    }
    if (fromDate && new Date(order.orderDate) < new Date(fromDate)) {
      return false;
    }
    if (toDate && new Date(order.orderDate) > new Date(toDate)) {
      return false;
    }
    return true;
  });

  return (
    <div className="purchase-order-summary">
      <div className="header">
        <h2>Purchase Order Summary</h2>
        <div className="filters">
          <div className="supplier-filter">
            <label>Select Supplier:</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="supplier-select"
            >
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>

          <div className="date-filters">
            <div className="date-input">
              <label>From:</label>
              <div className="date-field">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <Calendar className="calendar-icon" />
              </div>
            </div>

            <div className="date-input">
              <label>To:</label>
              <div className="date-field">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <Calendar className="calendar-icon" />
              </div>
            </div>

            <button onClick={handleSearch} className="search-btn">
              <Search className="search-icon" />
            </button>

            <button onClick={handlePrint} className="print-btn">
              <Printer className="print-icon" />
            </button>
          </div>
        </div>
      </div>

      <div className="orders-container">
        <div className="orders-header">
          <h3>Purchase Orders for {currentMonth}</h3>
        </div>
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Order No</th>
                <th>Supplier</th>
                <th>Items</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>PO-{order.id.toString().padStart(4, '0')}</td>
                  <td>{order.supplier}</td>
                  <td>
                    <ul className="items-list">
                      {order.items.map(item => (
                        <li key={item.id}>
                          {item.item} ({item.quantity} units)
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
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

export default ViewPurchaseOrder;