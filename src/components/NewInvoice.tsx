import React, { useState, useEffect } from 'react';
import { Save, Plus, Calendar } from 'lucide-react';
import '../styles/invoice.css';
import axios from 'axios';

interface InvoiceItem {
  id: number;
  itemCode: string;
  item: string;
  hsn: string;
  mrp: number;
  discountPercent: number;
  discountAmount: number;
  rate: number;
  qty: number;
  uom: string;
  gstPercent: number;
  gstAmount: number;
  total: number;
}

interface CustomerDetails {
  fullName: string;
  contactNo: string;
  address: string;
  gstin: string;
  state: string;
  hasDeliveryAddress: boolean;
}

const NewInvoice = () => {
  const [companies, setCompanies] = useState<{ ID: number; Company: string }[]>([]);
    const [supplier, setSupplier] = useState('');
    const [suppliers, setSuppliers] = useState<string[]>([]);
    const [custID, setCustID] = useState<string | null>(null);
    const [filteredSuppliers, setFilteredSuppliers] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
  const [invoiceNo] = useState('20250201/1');
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    contactNo: '',
    address: '',
    gstin: '',
    state: '',
    hasDeliveryAddress: false
  });



  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    itemCode: '',
    item: '',
    hsn: '',
    mrp: 0,
    discountPercent: 0,
    rate: 0,
    qty: 1,
    uom: '',
    gstPercent: 0
  });

  const [paymentDetails, setPaymentDetails] = useState({
    total: 0,
    gstType: 'GST',
    gstTotal: 0,
    transport: '',
    purchaseOrderNo: '',
    remark: '',
    saleDate: new Date().toISOString().split('T')[0],
    cash: 0,
    card: 0,
    bank: '',
    balance: 0
  });

  // adding 
  useEffect(() => {
    // Fetch suppliers from backend 
    axios.get('http://localhost:3000/suppliers') // Change to your backend URL if needed
      .then((response) => {
        // Extract FullName instead of State
        const supplierNames = response.data.map((supplier: any) => supplier.FullName);
        setSuppliers(supplierNames);
      })
      .catch((error) => {
        console.error('Error fetching suppliers:', error);
      });
  }, []);

  
  const handleSupplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSupplier = e.target.value; 
    setSupplier(selectedSupplier);
  
    if (selectedSupplier.length > 0) { 
      // Filter suppliers dynamically based on input
      const filtered = suppliers.filter((name: string) =>
        name.toLowerCase().includes(selectedSupplier.toLowerCase())
      );
      setFilteredSuppliers(filtered);
      setShowDropdown(filtered.length > 0); // Show dropdown only if matches exist
    } else {
      setShowDropdown(false); // Hide dropdown if input is empty
    }
  
    // Fetch CustID if the exact match exists
    axios.get(`http://localhost:3000/getCustomer?fullName=${selectedSupplier}`)
      .then((response) => {
        setCustID(response.data.CustID);
      })
      .catch(() => {
        setCustID(""); // Reset CustID if not found
      });
  };
  
  const selectSupplier = async (name: string) => {
    setSupplier(name);
    setShowDropdown(false);
  
    try {
      const response = await axios.get(`http://localhost:3000/getCustomer?fullName=${name}`);
      if (response.data?.CustID) {
        setCustID(response.data.CustID);
      } else {
        setCustID(null); //  Agar koi ID na mile toh null set karein
      }
    } catch (error) {
      console.error("Error fetching CustID:", error);
    }
  };

  // Ensure suppliers are fetched on mount
  useEffect(() => {
    axios.get("http://localhost:3000/suppliers")
      .then((response) => {
        const supplierNames = response.data.map((supplier: any) => supplier.FullName);
        setSuppliers(supplierNames);
        setFilteredSuppliers(supplierNames); // Initialize filtered suppliers
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, []);

  const states = [
    'Select',
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal'
  ];

  const calculateItemValues = (item: Partial<InvoiceItem>) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const discountPercent = Number(item.discountPercent) || 0;
    const gstPercent = Number(item.gstPercent) || 0;

    const subtotal = qty * rate;
    const discountAmount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const gstAmount = (afterDiscount * gstPercent) / 100;
    const total = afterDiscount + gstAmount;

    return {
      ...item,
      discountAmount,
      gstAmount,
      total
    };
  };

  const handleAddItem = () => {
    if (!newItem.itemCode || !newItem.item) {
      alert('Please fill in all required fields');
      return;
    }

    const calculatedItem = calculateItemValues(newItem);
    const newItems = [...items, { ...calculatedItem, id: Date.now() } as InvoiceItem];
    setItems(newItems);
    updateTotals(newItems);

    setNewItem({
      itemCode: '',
      item: '',
      hsn: '',
      mrp: 0,
      discountPercent: 0,
      rate: 0,
      qty: 1,
      uom: '',
      gstPercent: 0
    });
  };

  const updateTotals = (currentItems: InvoiceItem[]) => {
    const total = currentItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const gstTotal = currentItems.reduce((sum, item) => sum + (item.gstAmount || 0), 0);
    
    setPaymentDetails(prev => ({
      ...prev,
      total,
      gstTotal,
      balance: total - prev.cash - prev.card
    }));
  };

  const handleSave = () => {
    if (!customer.fullName || !customer.contactNo) {
      alert('Please fill in all required customer details');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }
    console.log({
      invoiceNo,
      customer,
      items,
      paymentDetails
    });
  };

  return (
    <div className="invoice-container">
      <div className="header">
        <h2>New GST Invoice</h2>
        <div className="invoice-number">Invoice No. {invoiceNo}</div>
      </div>

      <div className="customer-section">
        <div className="form-row">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={customer.fullName}
              onChange={handleSupplierChange}
              onFocus={()=> setShowDropdown(true)}
              onBlur={()=> setTimeout(()=> setShowDropdown(false), 200)}
              className="form-input"
            />
            {showDropdown && filteredSuppliers.length > 0 && (
                <ul className="dropdown-container">
                  {filteredSuppliers.map((name, index) => (
                    <li
                      key={index}
                      onClick={() => selectSupplier(name)}
                      className="dropdown-item"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              )}
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
          <div className="form-group">
            <label>GSTIN</label>
            <input
              type="text"
              value={customer.gstin}
              onChange={(e) => setCustomer({ ...customer, gstin: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <select
              value={customer.state}
              onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
              className="form-input"
            >
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={customer.hasDeliveryAddress}
                onChange={(e) => setCustomer({ ...customer, hasDeliveryAddress: e.target.checked })}
              />
              Delivery Address
            </label>
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
            <label>HSN</label>
            <input
              type="text"
              value={newItem.hsn}
              onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>MRP(Rs.)</label>
            <input
              type="number"
              value={newItem.mrp || ''}
              onChange={(e) => setNewItem({ ...newItem, mrp: parseFloat(e.target.value) })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Disc(%)</label>
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
            <label>UOM</label>
            <select
              value={newItem.uom}
              onChange={(e) => setNewItem({ ...newItem, uom: e.target.value })}
              className="form-input"
            >
              <option value="select">-Select-</option>
                  <option value="nos">nos</option>
                  <option value="kg">kg</option>
                  <option value="m">m</option>
                  <option value="gms">gms</option>
                  <option value="lbs">lbs</option>
                  <option value="liters">liters</option>
                  <option value="ml">ml</option>
                  <option value="cm">cm</option>
                  <option value="inches">inches</option>
                  <option value="feet">feet</option>
                  <option value="yards">yards</option>
                  <option value="tons">tons</option>
                  <option value="oz">oz</option>
                  <option value="pcs">pcs</option>
                  <option value="dozen">dozen</option>

            </select>
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
            <button onClick={handleAddItem} className="add-btn">
              <Plus className="icon" />
              ADD
            </button>
          </div>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Item Description</th>
              <th>MRP</th>
              <th>Dis(%)</th>
              <th>Dis(Rs.)</th>
              <th>Rate</th>
              <th>GST(%)</th>
              <th>GST(Rs.)</th>
              <th>Qty</th>
              <th>Total(Rs.)</th>
              <th>HSN</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.item}</td>
                <td>₹{item.mrp}</td>
                <td>{item.discountPercent}%</td>
                <td>₹{item.discountAmount.toFixed(2)}</td>
                <td>₹{item.rate}</td>
                <td>{item.gstPercent}%</td>
                <td>₹{item.gstAmount.toFixed(2)}</td>
                <td>{item.qty}</td>
                <td>₹{item.total.toFixed(2)}</td>
                <td>{item.hsn}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={11} className="empty-message">Please Add Items</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="payment-section">
        <div className="amount-summary">
          <div className="form-row">
            <div className="form-group">
              <label>Total (Rs.)</label>
              <input
                type="number"
                value={paymentDetails.total}
                readOnly
                className="form-input readonly"
              />
            </div>
            <div className="form-group">
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    checked={paymentDetails.gstType === 'GST'}
                    onChange={() => setPaymentDetails({ ...paymentDetails, gstType: 'GST' })}
                  />
                  GST
                </label>
                <label>
                  <input
                    type="radio"
                    checked={paymentDetails.gstType === 'IGST'}
                    onChange={() => setPaymentDetails({ ...paymentDetails, gstType: 'IGST' })}
                  />
                  IGST
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>GST Total</label>
              <input
                type="number"
                value={paymentDetails.gstTotal}
                readOnly
                className="form-input readonly"
              />
            </div>
          </div>
        </div>

        <div className="additional-details">
          <div className="form-row">
            <div className="form-group">
              <label>Transport</label>
              <select
                value={paymentDetails.transport}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, transport: e.target.value })}
                className="form-input"
              >
                <option value="">-select-</option>
                <option value="road">Road</option>
                <option value="air">Air</option>
                <option value="rail">Rail</option>
              </select>
            </div>
            <div className="form-group">
              <label>Purchase Order No.</label>
              <input
                type="text"
                value={paymentDetails.purchaseOrderNo}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, purchaseOrderNo: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Remark</label>
              <input
                type="text"
                value={paymentDetails.remark}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, remark: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Sale Date</label>
              <div className="date-field">
                <input
                  type="date"
                  value={paymentDetails.saleDate}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, saleDate: e.target.value })}
                  className="form-input"
                />
                <Calendar className="calendar-icon" />
              </div>
            </div>
          </div>
        </div>

        <div className="payment-methods">
          <div className="form-row">
            <div className="form-group">
              <label>Cash(Rs.)</label>
              <input
                type="number"
                value={paymentDetails.cash}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  cash: parseFloat(e.target.value) || 0,
                  balance: paymentDetails.total - (parseFloat(e.target.value) || 0) - paymentDetails.card
                })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Card(Rs.)</label>
              <input
                type="number"
                value={paymentDetails.card}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  card: parseFloat(e.target.value) || 0,
                  balance: paymentDetails.total - paymentDetails.cash - (parseFloat(e.target.value) || 0)
                })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Bank</label>
              <select
                value={paymentDetails.bank}
                onChange={(e) => setPaymentDetails({ ...paymentDetails, bank: e.target.value })}
                className="form-input"
              >
                <option value="">-select-</option>
                <option value="sbi">SBI</option>
                <option value="hdfc">HDFC</option>
                <option value="icici">ICICI</option>
              </select>
            </div>
            <div className="form-group">
              <label>Balance(Rs.)</label>
              <input
                type="number"
                value={paymentDetails.balance}
                readOnly
                className="form-input readonly"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button onClick={handleSave} className="save-btn">
          <Save className="icon" />
          Save
        </button>
      </div>
    </div>
  );
};

export default NewInvoice;