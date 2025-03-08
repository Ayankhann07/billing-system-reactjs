import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-1 pl-8 pr-4 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-200"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
        {theme === 'light' && <Sun className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
        {theme === 'dark' && <Moon className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
        {theme === 'system' && <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
      </div>
    </div>
  );
};

export default ThemeToggle;