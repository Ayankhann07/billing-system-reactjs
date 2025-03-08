import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';


interface PurchaseItem {
  id: number;
  category: string;
  itemDescription: string;
  hsn: string;
  qty: number;
  rate: number;
  discountPercent: number;
  discountAmount: number;
  gstPercent: number;
  gstAmount: number;
  netRate: number;
  total: number;
  mrp?: number;
  mainUnit: string;
  altUnit: string;
  conversionFactor: number;
}

interface PaymentDetails {
  taxValue: number;
  discount1: number;
  gst: number;
  discount2: number;
  other: number;
  tcs: number;
  netTotal: number;
  cash: number;
  cardUpi: number;
  cheque: number;
  chequeNo: string;
  bank: string;
  balance: number;
}

const AddPurchase: React.FC = () => {
  //ADD PURCHASE
  const [custID, setCustID] = useState<string | null>(null);
  //const [supplier, setSupplier] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [netTotal, setNetTotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [cash, setCash] = useState<number>(0);
  const [cheque, setCheque] = useState<number>(0);
  const [chequeNo, setChequeNo] = useState<string>("");
  const [accountNo, setAccountNo] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [vatAmount, setVatAmount] = useState<number>(0);
  const [vatPercentage, setVatPercentage] = useState<number>(0);
 // const [billNo, setBillNo] = useState<string>("");
 // const [remark, setRemark] = useState<string>("");
  const [isIGST, setIsIGST] = useState<boolean>(false);
  const [disc2, setDisc2] = useState<number>(0);

  //fetch companies
  const [companies, setCompanies] = useState<{ ID: number; Company: string }[]>([]);
  const [supplier, setSupplier] = useState('');
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [billNo, setBillNo] = useState('');
  const [remark, setRemark] = useState('');
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [payment, setPayment] = useState<PaymentDetails>({
    
    taxValue: 0,
    discount1: 0,
    gst: 0,
    discount2: 0,
    other: 0,
    tcs: 0,
    netTotal: 0,
    cash: 0,
    cardUpi: 0,
    cheque: 0,
    chequeNo: '',
    bank: '',
    balance: 0,

  });
 // const [netTotal, setNetTotal] = useState<number>(0);

// // Function to update netTotal
// const updateNetTotal = (newTotal: number) => {
//   setNetTotal(newTotal);
// };
  // Fetch supplier name
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
  
  const [newItem, setNewItem] = useState<Partial<PurchaseItem>>({
    category: '',
    itemDescription: '',
    hsn: '',
    qty: 0,
    rate: 0,
    discountPercent: 0,
    gstPercent: 0,
    mrp: 0,
    mainUnit: 'pcs',
    altUnit: 'pcs',
    conversionFactor: 1,
  });

  const calculateItemValues = (item: Partial<PurchaseItem>) => {
    const qty = Number(item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const discountPercent = Number(item.discountPercent) || 0;
    const gstPercent = Number(item.gstPercent) || 0;

    const subtotal = qty * rate;
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
  

  const addItem = () => {
    if (!newItem.itemDescription || !newItem.qty || !newItem.rate) {
      alert('Please fill in all required fields');
      return;
    }

    const calculatedItem = calculateItemValues(newItem);
    setItems((prevItems) => {
      const updatedItems = [...prevItems, { ...calculatedItem, id: Date.now() } as PurchaseItem];
      updatePaymentDetails(updatedItems);
      return updatedItems;
    });
    

    // Reset new item form
    setNewItem({
      category: '',
      itemDescription: '',
      hsn: '',
      qty: 0,
      rate: 0,
      discountPercent: 0,
      gstPercent: 0,
      mrp: 0,
      mainUnit: 'pcs',
      altUnit: 'pcs',
      conversionFactor: 1,
    });

    // Update payment details
    updatePaymentDetails([
      ...items,
      {
        ...calculatedItem,
        id: Date.now(),
      } as PurchaseItem,
    ]);
  };

  const removeItem = (id: number) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    updatePaymentDetails(updatedItems);
  };

  const updatePaymentDetails = (currentItems: PurchaseItem[]) => {
    const taxValue = currentItems.reduce((sum, item) => sum + item.total, 0);
    const gst = currentItems.reduce((sum, item) => sum + item.gstAmount, 0);
    
    setPayment(prev => {
      const netTotal = taxValue - prev.discount1 - prev.discount2 + prev.other + prev.tcs;
      const balance = netTotal - prev.cash - prev.cardUpi - prev.cheque;
      return { ...prev, taxValue, gst, netTotal, balance };
    });
  
    setNetTotal(netTotal); // ✅ Net total ko bhi state me save karo
  };
  

  const handlePaymentChange = (field: keyof PaymentDetails, value: number | string) => {
    setPayment(prev => {
        // Convert value to a number safely
        const numValue = typeof value === "string" && value.trim() !== "" ? parseFloat(value) : 0;

        const updated = { ...prev, [field]: numValue };

        //  Net Total Calculation
        const netTotal = 
            (updated.taxValue || 0) - 
            (updated.discount1 || 0) - 
            (updated.discount2 || 0) + 
            (updated.other || 0) + 
            (updated.tcs || 0);

        //  Balance Calculation
        const balance = 
            netTotal - 
            (updated.cash || 0) - 
            (updated.cardUpi || 0) - 
            (updated.cheque || 0);

        return { ...updated, netTotal, balance };
    });
};
useEffect(() => {
  console.log("Updated Payment State:", payment);
}, [payment]);



const handleSave = async () => {
  console.log("🟢 Button clicked! Saving Purchase...");

  if (!supplier || !custID) {
      alert("❌ Please select a valid supplier and enter Customer ID!");
      return;
  }

  const purchaseData = {
      Client_ID: "DD",
      Branch_ID: "A",
      CustID: custID ? Number(custID) : 0,
      PurchaseDate: new Date().toISOString(),
      Total: totalAmount ? Number(totalAmount) : 0,
      NetTotal: netTotal ? Number(netTotal) : 0,
      Discount : discount ? Number(discount) :0,
      Cash: cash ? Number(cash) : 0,
      Cheque: cheque ? Number(cheque) : 0,
      ChequeNo: chequeNo ? chequeNo.toString() : null,
      AcNo: accountNo ? accountNo.toString() : null,
      Balance: balance ? Number(balance) : 0,
      OtherChar: otherCharges ? Number(otherCharges) : 0,
      VATRs: vatAmount ? Number(vatAmount) : 0,
      VATPer: vatPercentage ? Number(vatPercentage) : 0,
      BillNo: billNo ? billNo.toString() : "",
      Remark: remark ? remark.toString() : "",
      IsIGST: isIGST ? true : false,
      Disc2: disc2 ? Number(disc2) : 0,
  };

  console.log("🔵 Data being sent to server:", JSON.stringify(purchaseData, null, 2));

  try {
    const response = await axios.post("http://localhost:3000/insertPurchase", purchaseData, {
        headers: { 'Content-Type': 'application/json' }
    });

    console.log("✅ Server Response:", response.data);

    if (response.data.success) {
        alert("✅ Purchase saved successfully! ID: " + (response.data.purchaseID || "N/A"));
    } else {
        alert("⚠️ Purchase was not saved. " + (response.data.message || "Unknown error."));
    }
  } catch (error) {
    console.error("❌ Error saving purchase:", error);

    if (axios.isAxiosError(error)) {
        console.error("❌ Axios Error:", error.response?.data);
        alert(`❌ Failed to save purchase. ${error.response?.data?.message || "Unknown error"}`);
    } else {
        alert("❌ An unexpected error occurred.");
    }
  }
};


  

  // Fetch companies when the component mounts
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getCompanies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };



  // const handleSubmit = async () => {
  //   try {
  //     const response = await fetch("http://localhost:3000/api/add-payment", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payment), // Sending entire payment object
  //     });
  
  //     const data = await response.json();
  //     if (response.ok) {
  //       alert("Payment details saved successfully!");
  //     } else {
  //       alert("Error saving payment: " + data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Failed to connect to server.");
  //   }
  // };
  

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        New Purchase
      </h2>

      {/* Supplier Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 border-indigo-500">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Supplier
          </label>
          <input
            type="text"
            value={supplier}
            onChange={handleSupplierChange}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            onFocus={()=> setShowDropdown(true)}
            onBlur={()=> setTimeout(()=> setShowDropdown(false), 200)}
          />
          {showDropdown && filteredSuppliers.length > 0 &&(
            <ul className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            {filteredSuppliers.map((name, index) => (
              <li
                key={index}
                onClick={() => selectSupplier(name)}
                className="p-2 cursor-pointer hover:bg-indigo-500 hover:text-white"
              >
                {name}
              </li>
            ))}
          </ul>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 border-indigo-500">
            Purchase Date
          </label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bill No
          </label>
          <input
            type="text"
            value={billNo}
            onChange={(e) => setBillNo(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Remark
          </label>
          <input
            type="text"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* New Item Form */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
                <option value="">Select</option>
                {companies.map((company) => (
                    <option key={company.ID} value={company.ID}>
                      {company.Company}
                    </option>
                  ))}

            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Item Description
            </label>
            <input
              type="text"
              value={newItem.itemDescription}
              onChange={(e) =>
                setNewItem({ ...newItem, itemDescription: e.target.value })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              HSN
            </label>
            <input
              type="text"
              value={newItem.hsn}
              onChange={(e) => setNewItem({ ...newItem, hsn: e.target.value })}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={newItem.qty || ''}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  qty: parseFloat(e.target.value),
                  ...calculateItemValues({
                    ...newItem,
                    qty: parseFloat(e.target.value),
                  }),
                })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rate
            </label>
            <input
              type="number"
              value={newItem.rate || ''}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  rate: parseFloat(e.target.value),
                  ...calculateItemValues({
                    ...newItem,
                    rate: parseFloat(e.target.value),
                  }),
                })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              MRP (Optional)
            </label>
            <input
              type="number"
              value={newItem.mrp || ''}
              onChange={(e) =>
                setNewItem({ ...newItem, mrp: parseFloat(e.target.value) })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Discount %
            </label>
            <input
              type="number"
              value={newItem.discountPercent || ''}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  discountPercent: parseFloat(e.target.value),
                  ...calculateItemValues({
                    ...newItem,
                    discountPercent: parseFloat(e.target.value),
                  }),
                })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              GST %
            </label>
            <input
              type="number"
              value={newItem.gstPercent || ''}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  gstPercent: parseFloat(e.target.value),
                  ...calculateItemValues({
                    ...newItem,
                    gstPercent: parseFloat(e.target.value),
                  }),
                })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Main Unit
            </label>
            <select
              value={newItem.mainUnit}
              onChange={(e) =>
                setNewItem({ ...newItem, mainUnit: e.target.value })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="pcs">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="m">Meters</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alt Unit
            </label>
            <select
              value={newItem.altUnit}
              onChange={(e) =>
                setNewItem({ ...newItem, altUnit: e.target.value })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="pcs">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="m">Meters</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Conv. Factor
            </label>
            <input
              type="number"
              value={newItem.conversionFactor || ''}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  conversionFactor: parseFloat(e.target.value),
                })
              }
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={addItem}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Item
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                HSN
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Disc %
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                GST
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                  {item.itemDescription}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                  {item.hsn}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                  {item.qty} {item.mainUnit}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                  ₹{item.rate.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                  {item.discountPercent}%
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                  {item.gstPercent}%
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">
                  ₹{item.total.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Amount Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
          <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax Value
                </label>
                <input
                  type="number"
                  value={payment.taxValue}
                  onChange={(e) =>
                    setPayment({ ...payment, taxValue: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm bg-gray-50"
                />
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount 1
              </label>
              <input
                type="number"
                value={payment.discount1}
                onChange={(e) =>
                  handlePaymentChange('discount1', e.target.value)
                }
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                GST
              </label>
              <input
                type="number"
                value={payment.gst}
                readOnly
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount 2
              </label>
              <input
                type="number"
                value={payment.discount2}
                onChange={(e) =>
                  handlePaymentChange('discount2', e.target.value)
                }
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Other
              </label>
              <input
                type="number"
                value={payment.other}
                onChange={(e) => handlePaymentChange('other', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                TCS
              </label>
              <input
                type="number"
                value={payment.tcs}
                onChange={(e) => handlePaymentChange('tcs', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Net Total
  </label>
  <input
    type="number"
    value={payment.netTotal}
    onChange={(e) => handlePaymentChange("netTotal", parseFloat(e.target.value) || 0)}
    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm bg-gray-50 text-lg font-bold"
  />
</div>

        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Payment Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cash
              </label>
              <input
                type="number"
                value={payment.cash}
                onChange={(e) => handlePaymentChange('cash', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Card/UPI
              </label>
              <input
                type="number"
                value={payment.cardUpi}
                onChange={(e) => handlePaymentChange('cardUpi', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cheque
              </label>
              <input
                type="number"
                value={payment.cheque}
                onChange={(e) => handlePaymentChange('cheque', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cheque No.
              </label>
              <input
                type="text"
                value={payment.chequeNo}
                onChange={(e) => handlePaymentChange('chequeNo', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bank
              </label>
              <select
                value={payment.bank}
                onChange={(e) => handlePaymentChange('bank', e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Bank</option>
                <option value="sbi">SBI</option>
                <option value="hdfc">HDFC</option>
                <option value="icici">ICICI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Balance
              </label>
              <input
                type="number"
                value={payment.balance}
                readOnly
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm bg-gray-50 text-lg font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
<div className="mt-6 flex justify-end">
  <button
    onClick={() => { 
      handleSave(); 
      // handleSubmit();
    }} // Call both functions
    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
  >
    <Save className="w-4 h-4 mr-2" />
    Save Purchase
  </button>
</div>


    </div>
  );
};

export default AddPurchase;