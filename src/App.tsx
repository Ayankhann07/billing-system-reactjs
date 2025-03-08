import React, { useState } from 'react';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import StockAlert from './components/StockAlert';
import PaymentAlert from './components/PaymentAlert';
import AddPurchase from './components/AddPurchase';
import PurchaseReturn from './components/PurchaseReturn';
import AddSupplier from './components/AddSupplier';
import PurchaseOrder from './components/PurchaseOrder';
import ViewPurchaseReturn from './components/ViewPurchaseReturn';
import ViewPurchases from './components/ViewPurchases';
import ViewPurchaseOrder from './components/ViewPurchaseOrder';
import NewInvoice from './components/NewInvoice';
import ViewInvoice from './components/ViewInvoice';
import ViewEstimate from './components/ViewEstimate';
import SaleReturn from './components/SaleReturn';
import Profile from './components/Profile';
import Login from './components/Login';
import Config from './components/Config';

function AdminPanel() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'addPurchase' | 'purchaseReturn' | 'addSupplier' | 'purchaseOrder' | 'viewPurchaseReturn' | 'viewPurchases' | 'viewPurchaseOrder' | 'newInvoice' | 'viewInvoice' | 'viewEstimate' | 'salesReturn' | 'profile' | 'config'>('dashboard');

  return (
    <Layout 
      onNavigate={(view) => setCurrentView(view as typeof currentView)}
      currentView={currentView}
    >
      {currentView === 'dashboard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <StockAlert />
          <PaymentAlert />
        </div>
      ) : currentView === 'addPurchase' ? (
        <AddPurchase />
      ) : currentView === 'purchaseReturn' ? (
        <PurchaseReturn />
      ) : currentView === 'purchaseOrder' ? (
        <PurchaseOrder />
      ) : currentView === 'viewPurchaseReturn' ? (
        <ViewPurchaseReturn />
      ) : currentView === 'viewPurchases' ? (
        <ViewPurchases />
      ) : currentView === 'viewPurchaseOrder' ? (
        <ViewPurchaseOrder />
      ) : currentView === 'newInvoice' ? (
        <NewInvoice />
      ) : currentView === 'viewInvoice' ? (
        <ViewInvoice />
      ) : currentView === 'viewEstimate' ? (
        <ViewEstimate />
      ) : currentView === 'salesReturn' ? (
        <SaleReturn />
      ) : currentView === 'profile' ? (
        <Profile />
      ) : currentView === 'config' ? (
        <Config />
      ) : (
        <AddSupplier />
      )}
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AdminPanel /> : <Login />;
}

export default App;