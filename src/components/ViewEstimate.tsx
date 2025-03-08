import React, { useState } from 'react';
import { Search, Calendar, Printer } from 'lucide-react';
import '../styles/viewEstimate.css';

interface Estimate {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const ViewEstimate = () => {
  const [customer, setCustomer] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Mock data - replace with actual data in production
  const [estimates] = useState<Estimate[]>([
    {
      id: 'EST001',
      date: '2025-02-01',
      customer: 'Customer A',
      amount: 5000,
      status: 'Pending'
    },
    {
      id: 'EST002',
      date: '2025-02-05',
      customer: 'Customer B',
      amount: 7500,
      status: 'Approved'
    }
  ]);

  const handleSearch = () => {
    console.log('Searching:', {
      customer,
      fromDate,
      toDate
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredEstimates = estimates.filter(estimate => {
    if (customer && !estimate.customer.toLowerCase().includes(customer.toLowerCase())) {
      return false;
    }
    if (fromDate && new Date(estimate.date) < new Date(fromDate)) {
      return false;
    }
    if (toDate && new Date(estimate.date) > new Date(toDate)) {
      return false;
    }
    return true;
  });

  return (
    <div className="view-estimate-container">
      <h2 className="view-estimate-title">View Estimate</h2>
      
      <div className="search-section">
        <div className="search-row">
          <div className="search-group">
            <label>Customer:</label>
            <input
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="search-input"
              placeholder="Search customer..."
            />
          </div>

          <div className="search-group">
            <label>From:</label>
            <div className="date-field">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="search-input"
              />
              <Calendar className="calendar-icon" />
            </div>
          </div>

          <div className="search-group">
            <label>To:</label>
            <div className="date-field">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="search-input"
              />
              <Calendar className="calendar-icon" />
            </div>
          </div>

          <button onClick={handleSearch} className="search-btn">
            <Search className="icon" />
          </button>
        </div>
      </div>

      <div className="estimates-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Estimate No</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEstimates.map((estimate) => (
              <tr key={estimate.id}>
                <td>{new Date(estimate.date).toLocaleDateString()}</td>
                <td>{estimate.id}</td>
                <td>{estimate.customer}</td>
                <td>₹{estimate.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${estimate.status.toLowerCase()}`}>
                    {estimate.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredEstimates.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-message">
                  No estimates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="action-buttons">
        <button onClick={handlePrint} className="print-btn">
          <Printer className="icon" />
          Print
        </button>
      </div>
    </div>
  );
};

export default ViewEstimate;