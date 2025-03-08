import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './project.env' });

const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST'],  // Sirf POST aur GET allow karna
  allowedHeaders: ['Content-Type']
}));
app.use(express.json()); // Enable JSON body parsing

// MSSQL Configuration
const config = {
  user: 'aman',
  password: '19protocol',
  server: '159.69.173.180',
  database: 'aman',
  options: {
    encrypt: true, // If using Windows Azure, or false if not
    trustServerCertificate: true, // True if connecting to a server with an untrusted certificate
    port: 1433 // Port number
  }
};

// Connect to the database
async function connectDB() {
  try {
    await sql.connect(config);
    console.log('✅ Connected to MSSQL');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

connectDB();

app.post('/login', async (req, res) => {
  const { UserId, Password, UserIP } = req.body;

  try {
    const request = new sql.Request();

    // Set input parameters for the stored procedure
    request.input('UserName', sql.VarChar, UserId);
    request.input('Password', sql.VarChar, Password);
    request.input('UserIP', sql.VarChar, UserIP || null);  // Optional

    // Call the stored procedure
    const result = await request.execute('J_spGetLoginDetails');

    // If the procedure returns data (successful login)
    if (result.recordset.length > 0) {
      res.json({
        success: true,
        user: result.recordset[0], // Return user data from the stored procedure result
      });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  } 
});

// Add Supplier Endpoint
// app.post("/addSupplier", async (req, res) => {
//   try {
//     let pool = await sql.connect(config);
//     let result = await pool
//       .request()
//       .input("SupplierName", sql.VarChar(50), req.body.name)
//       .input("Contact", sql.VarChar(20), req.body.contact_no || null)
//       .input("Address", sql.VarChar(100), req.body.address || null)
//       .input("GSTIN", sql.VarChar(20), req.body.gstin || null)
//       .input("State", sql.VarChar(50), req.body.state || null)
//       .output("SupplierID", sql.Int) // Output parameter to get inserted ID
//       .execute("P_spInsertSupplier"); // Stored procedure call karega

//     console.log("Stored Procedure Output:", result.output);

//     if (result.output.SupplierID) {
//       res.json({ success: true, id: result.output.SupplierID });
//     } else {
//       res.status(500).json({ success: false, message: "Supplier ID not returned" });
//     }
//   } catch (error) {
//     console.error("Error adding supplier:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });





// load suppier

app.get('/suppliers', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("ClientID", sql.VarChar(10), 'DD')
      .input("BranchID", sql.VarChar(10), 'A')
      .input("IsSupplier", sql.VarChar(10), '1')
      .execute("J_spGetCustomer");

    res.json(result.recordset); // Ensure State is included
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
});


// DELETE SUPPLIER

app.delete("/deleteSupplier/:CustID", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { CustID } = req.params;

    const result = await pool
      .request()
      .input("CustID", sql.Int, CustID)
      .execute("A_spDeleleCust");

    res.json({ message: "Supplier deleted successfully", result });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/getCustomer", async (req, res) => {
  const { fullName } = req.query;

  if (!fullName) {
    return res.status(400).json({ error: "Full name is required" });
  }

  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("ClientID", sql.VarChar(20), "DD") // Change as required
      .input("BranchID", sql.VarChar(20), "A") // Change as required
      .input("CustName", sql.VarChar(20), fullName)
      .input("MobNo", sql.VarChar(20), "%[A-Z a-z 0-9]%")
      .input("City", sql.VarChar(50), "%[A-Z a-z]%")
      .input("IsSupplier", sql.VarChar(10), "1")
      .execute("J_spGetCustomer");

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]); // Return the first match
    } else {
      res.status(404).json({ error: "Customer not found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});




// EDIT SUPPLIER
app.put("/updateSupplier/:ID", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const { ID } = req.params;
    const { name, address, City, contact_no, TinNo, State, CrLimit, Beat, DOB } = req.body;

    console.log("Received ID:", ID);
    console.log("Received Data:", req.body);  

    if (!ID) {
      console.error("Error: Missing ID parameter.");
      return res.status(400).json({ error: "ID parameter is required" });
    }

    // Fetch existing supplier data before updating
    const existingSupplier = await pool
  .request()
  .input("ID", sql.Int, parseInt(ID))
  .query("SELECT * FROM J_Customers WHERE CustID = @ID");


    if (!existingSupplier.recordset.length) {
      console.error(`Error: Supplier with ID ${ID} not found.`);
      return res.status(404).json({ error: "Supplier not found" });
    }

    const currentData = existingSupplier.recordset[0];
    console.log("Current Supplier Data:", currentData);

    // Only update fields that exist in req.body; keep others unchanged
    const request = pool.request()
      .input("ID", sql.Int, parseInt(ID))
      .input("name", sql.VarChar(50), name ?? currentData.name)
      .input("address", sql.VarChar(50), address ?? currentData.address)
      .input("City", sql.VarChar(20), City ?? currentData.City)
      .input("contact_no", sql.VarChar(100), contact_no !== undefined ? contact_no : currentData.contact_no)
      .input("TinNo", sql.VarChar(20), TinNo ?? currentData.TinNo)
      .input("State", sql.VarChar(50), State ?? currentData.State)
      .input("CrLimit", sql.Numeric(10, 2), CrLimit ?? currentData.CrLimit)
      .input("Beat", sql.VarChar(50), Beat ?? currentData.Beat)
      .input("DOB", sql.VarChar(20), DOB ?? currentData.DOB);

    console.log("Executing Stored Procedure with Parameters:", {
      
    });

    const result = await request.execute("J_spUpdateCust");

    console.log("Update Success:", result);

    res.json({ message: "Supplier updated successfully", result });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update supplier", details: err.message });
  }
});

// API to Insert a Company
app.post("/addCompany", async (req, res) => {
  try {
    const { clientID, branchID, Company } = req.body;

    if (!Company) {
      return res.status(400).json({ error: "Company name is required" });
    }

    await sql.connect(config);

    const request = new sql.Request();
    request.input("Client_ID", sql.VarChar(20), clientID);
    request.input("Branch_ID", sql.VarChar(20), branchID);
    request.input("Company", sql.VarChar(30), Company);

    const result = await request.execute("J_spInsertCompany"); // Calling the stored procedure

    console.log("SQL Result:", result); // Debugging

    res.status(201).json({ message: "Company added successfully", result: result.recordset });
  } catch (error) {
    console.error("Error adding company:", error);
    res.status(500).json({ error: error.message });
  }
});


// Fetch companies for config
app.get("/getCompanies", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const clientID = "DD"; // Replace with dynamic value if needed
    const branchID = "A"; // Replace with dynamic value if needed

    const result = await pool
      .request()
      .input("Client_ID", sql.VarChar(20), clientID)
      .input("Branch_ID", sql.VarChar(20), branchID)
      .execute("J_spGetCompany");

    res.json(result.recordset); // Return the fetched companies
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API to insert a purchase record
// Insert Purchase API
app.post('/insertPurchase', async (req, res) => {
  try {
      console.log("🔹 Received Data from React:", JSON.stringify(req.body, null, 2));

      const pool = await sql.connect(config);
      const request = pool.request();

      // Logging request body
      console.log("🔍 Extracted Request Body:", req.body);

      // Ensure all inputs are handled correctly
      request.input('Client_ID', sql.VarChar(20), req.body.Client_ID);
      request.input('Branch_ID', sql.VarChar(20), req.body.Branch_ID);
      request.input('CustID', sql.Int, req.body.CustID);
      request.input('PurchaseDate', sql.DateTime, req.body.PurchaseDate);
      request.input('Total', sql.Decimal(12, 2), req.body.Total);
      request.input('NetTotal', sql.Decimal(12, 2), req.body.NetTotal);
      request.input('Discount', sql.Decimal(12, 2), req.body.Discount);
      request.input('Cash', sql.Decimal(12, 2), req.body.Cash);
      request.input('Cheque', sql.Decimal(12, 2), req.body.Cheque);
      request.input('ChequeNo', sql.VarChar(10), req.body.ChequeNo || null);
      request.input('AcNo', sql.VarChar(30), req.body.AcNo || null);
      request.input('Balance', sql.Decimal(12, 2), req.body.Balance);
      request.input('OtherChar', sql.Float, req.body.OtherChar);
      request.input('VATRs', sql.Float, req.body.VATRs);
      request.input('VATPer', sql.Float, req.body.VATPer);
      request.input('BillNo', sql.VarChar(50), req.body.BillNo);
      request.input('Remark', sql.VarChar(100), req.body.Remark);
      request.input('IsIGST', sql.Bit, req.body.IsIGST);
      request.input('Disc2', sql.Decimal(12, 2), req.body.Disc2);

      console.log("🔹 Parameterized Query Inputs Set Successfully!");

      // Logging the SQL Query (for debugging)
      const sqlQuery = `
          INSERT INTO P_Purchases (
              Client_ID, Branch_ID, CustID, PurchaseDate, Total, NetTotal, Discount, Cash, Cheque, 
              ChequeNo, AcNo, Balance, OtherCharges, VATRs, VATPer, BillNo, Remark, IsIGST, Discount2
          ) VALUES (
              @Client_ID, @Branch_ID, @CustID, @PurchaseDate, @Total, @NetTotal, @Discount, @Cash, @Cheque, 
              @ChequeNo, @AcNo, @Balance, @OtherChar, @VATRs, @VATPer, @BillNo, @Remark, @IsIGST, @Disc2
          );
      `;

      console.log("🔹 SQL Query to be executed:\n", sqlQuery);

      console.log("🔹 Executing Direct SQL Insert...");
      const result = await request.query(sqlQuery);

      console.log("✅ Insert Success:", JSON.stringify(result, null, 2));

      res.json({ success: true, message: "Purchase inserted successfully!", data: result });

  } catch (error) {
      console.error("❌ Error in Purchase Insert:", error);

      // Log specific SQL error
      if (error.code) {
          console.error("🔴 SQL Error Code:", error.code);
      }
      res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});

  // Invoice insert
  // API to insert invoice
app.post("/insert-invoice", async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool
      .request()
      .input("Client_ID", sql.VarChar(20), req.body.Client_ID)
      .input("Branch_ID", sql.VarChar(20), req.body.Branch_ID)
      .input("InvoiceNo", sql.VarChar(30), req.body.InvoiceNo || null)
      .input("InvoiceID", sql.Int, req.body.InvoiceID || null)
      .input("SNO", sql.VarChar(10), req.body.SNO || null)
      .input("CustID", sql.Int, req.body.CustID || null)
      .input("CustName", sql.VarChar(50), req.body.CustName || "CASH")
      .input("ContactNo", sql.VarChar(12), req.body.ContactNo || null)
      .input("SaleTotal", sql.Numeric(12, 2), req.body.SaleTotal)
      .input("OtherCharges", sql.Decimal(10, 2), req.body.OtherCharges || 0)
      .input("VATRs", sql.Decimal(10, 2), req.body.VATRs || 0)
      .input("VATPer", sql.Float, req.body.VATPer || null)
      .input("Discount", sql.Decimal(10, 2), req.body.Discount || 0)
      .input("Cash", sql.Decimal(10, 2), req.body.Cash || 0.0)
      .input("Card", sql.Decimal(10, 2), req.body.Card || 0.0)
      .input("UPI", sql.Numeric(10, 2), req.body.UPI || 0)
      .input("Cheque", sql.Decimal(10, 2), req.body.Cheque || 0.0)
      .input("ChequeNo", sql.VarChar(20), req.body.ChequeNo || null)
      .input("AcNo", sql.VarChar(20), req.body.AcNo || null)
      .input("NetTotal", sql.Numeric(10, 2), req.body.NetTotal || null)
      .input("Balance", sql.Numeric(10, 2), req.body.Balance || 0)
      .input("ReturnTotal", sql.Numeric(10, 2), req.body.ReturnTotal || null)
      .input("PreBalance", sql.Float, req.body.PreBalance || null)
      .input("SaleDate", sql.DateTime, req.body.SaleDate || null)
      .input("Remark", sql.VarChar(100), req.body.Remark || null)
      .input("IsIGST", sql.Bit, req.body.IsIGST || 0)
      .input("InsertedBy", sql.VarChar(50), req.body.InsertedBy)
      .input("TransportID", sql.Int, req.body.TransportID || null)
      .input("DlvAdd", sql.VarChar(200), req.body.DlvAdd || null)
      .input("IsEstimate", sql.Int, req.body.IsEstimate || 1)
      .input("OrderID", sql.Int, req.body.OrderID || null)
      .input("Prefix", sql.VarChar(20), req.body.Prefix || null)
      .input("PONo", sql.VarChar(50), req.body.PONo || null)
      .output("result", sql.Int)
      .execute("J_spInsertInvoice");

    res.status(200).json({ success: true, invoiceID: result.output.result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error inserting invoice" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
