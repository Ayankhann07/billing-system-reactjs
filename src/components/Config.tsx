import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/config.css';

const Config: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>("");
  const [companies, setCompanies] = useState<{ ID: number; Company: string }[]>([]);

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

  const addCompany = async () => {
    if (companyName.trim() !== "") {
      try {
        await axios.post("http://localhost:3000/addCompany", {
          clientID: "DD",
          branchID: "A",
          Company: companyName
        });
        setCompanyName("");
        fetchCompanies(); 
      } catch (error) {
        console.error("Error adding company:", error);
      }
    }
  };

  const removeCompany = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/deleteCompany/${id}`);
      setCompanies(companies.filter(company => company.ID !== id)); // Update UI
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };
  

  return (
    <div className="config-container">
      <div className="sidebar">
        <ul className="space-y-4 text-blue-600 font-semibold">
          <li className="cursor-pointer hover:underline">Company</li>
          <li className="cursor-pointer hover:underline">Ledger</li>
          <li className="cursor-pointer hover:underline">Bank Account</li>
          <li className="cursor-pointer hover:underline">Transport</li>
          <li className="cursor-pointer hover:underline">Terms & Conditions</li>
        </ul>
      </div>

      <div className="add-company">
        <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-black dark:text-white">Company</h2>
          <input 
            type="text" 
            placeholder="Company Name" 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)} 
            className="border rounded p-2 mr-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          <button 
            onClick={addCompany} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            ADD
          </button>
          <table className="w-full mt-4 border dark:border-gray-600">
            <thead>
              <tr className="bg-gray-700 dark:bg-gray-900 text-white">
                <th className="p-2">Sr.</th>
                <th className="p-2">Company</th>
                <th className="p-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => (
                <tr key={company.ID} className="border text-center dark:border-gray-600">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2 text-black dark:text-white">{company.Company}</td>
                  <td 
                        className="p-2 text-red-500 cursor-pointer" 
                        onClick={() => removeCompany(company.ID)}
                        >
                        🗑️
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

export default Config;
