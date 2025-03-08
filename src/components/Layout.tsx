import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Shortcuts from './Shortcuts';
import AlertsPanel from './AlertsPanel';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: string) => void;
  currentView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentView }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onNavigate={onNavigate} />
      <div className="lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(true)} onNavigate={onNavigate} />
        <main className="p-4 md:p-8">
          {currentView === 'dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Shortcuts />
                {children}
              </div>
              <div className="lg:col-span-1">
                <AlertsPanel />
              </div>
            </div>
          ) : (
            <div className="w-full">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;