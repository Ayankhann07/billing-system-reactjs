import React, { useState } from 'react';
import { Search, Calendar, Printer } from 'lucide-react';
import '../styles/viewInvoice.css';

interface Invoice {
  id: string;
  date: string;
  customer: string;
  amount: number;
  type: 'GST' | 'IGST' | 'Bill' | 'Challan';
}

const ViewInvoice = () => {
  const [customer, setCustomer] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [invoiceType, setInvoiceType] = useState<'all' | 'bill' | 'challan'>('all');
  const [gstType, setGstType] = useState<'all' | 'gst' | 'igst'>('all');

  // Mock data - replace with actual data in production
  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV001',
      date: '2025-02-01',
      customer: 'Customer A',
      amount: 5000,
      type: 'GST'
    },
    {
      id: 'INV002',
      date: '2025-02-05',
      customer: 'Customer B',
      amount: 7500,
      type: 'Bill'
    }
  ]);

  const handleSearch = () => {
    console.log('Searching:', {
      customer,
      fromDate,
      toDate,
      invoiceType,
      gstType
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (customer && !invoice.customer.toLowerCase().includes(customer.toLowerCase())) {
      return false;
    }
    if (fromDate && new Date(invoice.date) < new Date(fromDate)) {
      return false;
    }
    if (toDate && new Date(invoice.date) > new Date(toDate)) {
      return false;
    }
    if (invoiceType !== 'all') {
      if (invoiceType === 'bill' && invoice.type !== 'Bill') {
        return false;
      }
      if (invoiceType === 'challan' && invoice.type !== 'Challan') {
        return false;
      }
    }
    if (gstType !== 'all') {
      if (gstType === 'gst' && invoice.type !== 'GST') {
        return false;
      }
      if (gstType === 'igst' && invoice.type !== 'IGST') {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="view-invoice-container">
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

        <div className="filter-row">
          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={invoiceType === 'all'}
                onChange={() => setInvoiceType('all')}
                name="invoiceType"
              />
              All
            </label>
            <label>
              <input
                type="radio"
                checked={invoiceType === 'bill'}
                onChange={() => setInvoiceType('bill')}
                name="invoiceType"
              />
              Bill
            </label>
            <label>
              <input
                type="radio"
                checked={invoiceType === 'challan'}
                onChange={() => setInvoiceType('challan')}
                name="invoiceType"
              />
              Challan
            </label>
          </div>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={gstType === 'all'}
                onChange={() => setGstType('all')}
                name="gstType"
              />
              All
            </label>
            <label>
              <input
                type="radio"
                checked={gstType === 'gst'}
                onChange={() => setGstType('gst')}
                name="gstType"
              />
              GST
            </label>
            <label>
              <input
                type="radio"
                checked={gstType === 'igst'}
                onChange={() => setGstType('igst')}
                name="gstType"
              />
              IGST
            </label>
          </div>

          <button onClick={handlePrint} className="print-btn">
            <Printer className="icon" />
          </button>
        </div>
      </div>

      <div className="invoices-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice No</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{new Date(invoice.date).toLocaleDateString()}</td>
                <td>{invoice.id}</td>
                <td>{invoice.customer}</td>
                <td>₹{invoice.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${invoice.type.toLowerCase()}`}>
                    {invoice.type}
                  </span>
                </td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={5} className="empty-message">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewInvoice;