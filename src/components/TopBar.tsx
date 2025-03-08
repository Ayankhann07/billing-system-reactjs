import React from 'react';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
  onNavigate?: (view: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, onNavigate }) => {
  const { logout } = useAuth();
  const currentUser = "Demo User";
  const currentDate = new Date().toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handleProfileClick = () => {
    if (onNavigate) {
      onNavigate('profile');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            className="p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5 dark:text-gray-200" />
          </button>
          <div className="ml-4">
            <span className="text-gray-600 dark:text-gray-300">Welcome : </span>
            <span className="font-medium text-gray-900 dark:text-white">{currentUser}</span>
            <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">{currentDate}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <Bell className="w-5 h-5 dark:text-gray-200" />
          </button>
          {/* <button 
            onClick={handleProfileClick}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User className="w-5 h-5 dark:text-gray-200" />
          </button> */}
          <div className="flex space-x-2 text-sm">
            <button 
              onClick={handleProfileClick}
              className="text-green-600 hover:text-green-700 dark:text-green-400"
            >
              Profile
            </button>
            <button 
              onClick={logout}
              className="text-red-600 hover:text-red-700 dark:text-red-400 flex items-center"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;