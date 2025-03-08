import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import '../styles/supplier.css';

interface Supplier {
  id: number ;
  name: string ;
  contact_no: string; 
  address: string;
  gstin: string;
  state: string;
}

const STATES = ['Select', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

const AddSupplier = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    name: '',
    contact_no: '',
    address: '',
    gstin: '',
    state: 'Select'
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Supplier | null>(null);


  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/suppliers");
      
      console.log("API Response:", response.data); // Debugging
      
      if (response.data && Array.isArray(response.data)) {
        const formattedSuppliers = response.data.map((supplier: any) => ({
          id: supplier.CustID,
          name: supplier.FullName,
          contact_no: supplier.ContactNo,
          address: supplier.Address,
          gstin: supplier.TinNo,
          state: supplier.State
        }));
        
        setSuppliers(formattedSuppliers);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Error loading suppliers:", error);
      showMessage("Failed to load suppliers", "error");
    }
  };
  

  const validateForm = (data: typeof formData) => {
    if (!data.name.trim()) {
      showMessage('Supplier name is required', 'error');
      return false;
    }
    if (!data.contact_no.trim() || !/^\d{10}$/.test(data.contact_no)) {
      showMessage('Valid 10-digit contact number is required', 'error');
      return false;
    }
    if (!data.gstin.trim() || !/^\d{15}$/.test(data.gstin)) {
      showMessage('Valid 15-digit GSTIN is required', 'error');
      return false;
    }
    if (data.state === 'Select') {
      showMessage('Please select a state', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm(formData)) return;
    
    const supplierData = {
      Client_ID: "DD",
      Branch_ID: "A",
      Supplier: formData.name,
      FullName: formData.name,
      Address: formData.address,
      //City: formData.state,
      State:formData.state,
      ContactNo: formData.contact_no,
      TinNo: formData.gstin,
    };

    try {
      const response = await axios.post('http://localhost:3000/addSupplier', supplierData);
      const newSupplier = { ...formData, id: response.data.id };
      setSuppliers([...suppliers, newSupplier]);
      showMessage('Supplier added successfully', 'success');
      setFormData({
        name: '',
        contact_no: '',
        address: '',
        gstin: '',
        state: 'Select'
      });
    } catch (error) {
      console.error('Error:', error);
      showMessage('Failed to save supplier. Please try again.', 'error');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setEditData({ ...supplier });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  
  const handleSaveEdit = async () => {
    if (!editData || !validateForm(editData)) return;

    console.log("Edit Data Before Update:", editData);

    const originalSupplier = suppliers.find((supplier) => supplier.id === Number(editData.id));
    if (!originalSupplier) return;

    // Ensure all fields are updated properly
    const updatedFields: Partial<Supplier> = {
        id: originalSupplier.id,
        name: editData.name ?? originalSupplier.name,
        address: editData.address ?? originalSupplier.address,
        //city: editData.city ?? originalSupplier.city,
        contact_no: editData.contact_no ?? originalSupplier.contact_no, 
        gstin: editData.gstin ?? originalSupplier.gstin,
        state: editData.state ?? originalSupplier.state,
        // Add any other fields needed
    };

    console.log("Updated Fields Sent to API:", updatedFields);

    try {
        await axios.put(`http://localhost:3000/updateSupplier/${editData.id}`, updatedFields);

        setSuppliers((prev) =>
            prev.map((supplier) =>
                supplier.id === Number(editData.id)
                    ? { ...supplier, ...updatedFields }
                    : supplier
            )
        );

        console.log("Updated Supplier List:", suppliers);

        showMessage("Supplier updated successfully", "success");
        setEditingId(null);
        setEditData(null);
    } catch (error) {
        console.error("Error updating supplier:", error);
        showMessage("Failed to update supplier. Please try again.", "error");
    }
};


  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      await axios.delete(`http://localhost:3000/deleteSupplier/${id}`);
      setSuppliers(suppliers.filter(supplier => supplier.id !== id));
      showMessage('Supplier deleted successfully', 'success');
    } catch (error) {
      console.error('Error:', error);
      showMessage('Failed to delete supplier. Please try again.', 'error');
    }
  };

  const showMessage = (text: string, type: string) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <div className="supplier-container">
      <h2 className="supplier-title">Add/Update Supplier</h2>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="supplier-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Supplier Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="Enter supplier name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contact No</label>
            <input
              type="text"
              value={formData.contact_no}
              onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
              className="form-input"
              placeholder="10-digit number"
              maxLength={10}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
              placeholder="Enter address"
            />
          </div>
          <div className="form-group">
            <label className="form-label">GSTIN</label>
            <input
              type="text"
              value={formData.gstin}
              onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
              className="form-input"
              placeholder="15-digit GSTIN"
              maxLength={15}
            />
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="form-input"
            >
              {STATES.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <button onClick={handleSubmit} className="add-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="suppliers-table-container">
        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Sr.</th>
              <th>Supplier</th>
              <th>Contact No</th>
              <th>Address</th>
              <th>GSTIN</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier.id}>
                <td>{index + 1}</td>
                {editingId === supplier.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editData?.name || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData?.contact_no || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, contact_no: e.target.value } : null)}
                        className="form-input"
                        maxLength={10}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData?.address || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, address: e.target.value } : null)}
                        className="form-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData?.gstin || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, gstin: e.target.value } : null)}
                        className="form-input"
                        maxLength={15}
                      />
                    </td>
                    <td>
                      <select
                        value={editData?.state || 'Select'}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, state: e.target.value } : null)}
                        className="form-input"
                      >
                        {STATES.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={handleSaveEdit} className="save-btn" title="Save">
                          <Save className="w-4 h-4" />
                        </button>
                        <button onClick={handleCancelEdit} className="cancel-btn" title="Cancel">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{supplier.name}</td>
                    <td>{supplier.contact_no}</td>
                    <td>{supplier.address}</td>
                    <td>{supplier.gstin}</td>
                    <td>{supplier.state}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(supplier)} className="edit-btn" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(supplier.id)} className="delete-btn" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddSupplier;