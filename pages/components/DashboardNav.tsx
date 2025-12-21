import { useRouter } from 'next/router';
import { ProfileMenu } from './ProfileMenu';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Logo from '../../components/Logo';

export const DashboardNav: React.FC = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md transition-colors duration-200 z-50">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <Logo linkTo="/" />
          <nav className="hidden md:flex items-center space-x-6 ml-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-healing-600 dark:hover:text-healing-400 transition-colors duration-200"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-healing-600 dark:hover:text-healing-400 transition-colors duration-200"
            >
              Profile
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-healing-600 dark:hover:text-healing-400 transition-colors duration-200"
            >
              Settings
            </button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <ProfileMenu />
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};