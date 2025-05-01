import { useRouter } from 'next/router';
import Link from 'next/link';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from 'next-themes';
import Logo from '../../components/Logo';

export const AuthNavbar = () => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-cool-400/90 backdrop-blur-sm shadow-sm z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo section - updated to use the Logo component */}
          <div className="flex-shrink-0 flex items-center">
            <Logo linkTo="/" />
          </div>

          {/* Navigation Links & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <div className='relative z-50'>
              <ThemeToggle />
            </div>

            {/* Rest of navigation stays the same */}
            <Link
              href="/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${router.pathname === '/login'
                  ? 'bg-teal-500 text-white dark:bg-teal-600'
                  : 'text-teal-600 hover:text-teal-700 dark:text-teal-100 dark:hover:text-teal-50'
                }`}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${router.pathname === '/signup'
                  ? 'bg-teal-500 text-white dark:bg-teal-600'
                  : 'border-2 border-teal-500 text-teal-600 hover:bg-teal-50                     dark:border-teal-400 dark:text-teal-100 dark:hover:bg-teal-900/30'
                }`}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};