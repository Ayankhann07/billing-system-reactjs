// const express = require("express");
// const sql = require("mssql");

// const router = express.Router();


// const config = {
//     user: 'aman',
//     password: '19protocol',
//     server: '159.69.173.180',
//     database: 'aman',
//     options: {
//       encrypt: true, // If using Windows Azure, or false if not
//       trustServerCertificate: true, // True if connecting to a server with an untrusted certificate
//       port: 1433 // Port number
//   },
// };

// router.post("/addSupplier", async (req, res) => {
//   try {
//     let pool = await sql.connect(config);
//     const { Client_ID, Branch_ID, Supplier, FullName, Address, City, ContactNo, TinNo } = req.body;

//     let result = await pool
//       .request()
//       .input("Client_ID", sql.VarChar(20), Client_ID)
//       .input("Branch_ID", sql.VarChar(20), Branch_ID)
//       .input("Supplier", sql.VarChar(100), Supplier)
//       .input("FullName", sql.VarChar(50), FullName)
//       .input("Address", sql.VarChar(80), Address)
//       .input("City", sql.VarChar(50), City)
//       .input("ContactNo", sql.VarChar(12), ContactNo)
//       .input("TinNo", sql.VarChar(20), TinNo)
//       .execute("P_spInsertSupplier");

//     res.json({ message: "Supplier added successfully", result });
//   } catch (err) {
//     console.error("Database Error:", err);
//     res.status(500).json({ error: "Database insertion failed" });
//   }
// });

// module.exports = router;
