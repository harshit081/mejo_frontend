import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileMenu } from './ProfileMenu';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

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
          <Link href="/" className="w-[104px] h-[56px] relative cursor-pointer">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/afde0c8e534c73a3b3de25519a738956e2de66092dacd940229384d6d666eec0"
              alt="Company logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
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