import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { DashboardNav } from '../pages/components/DashboardNav';

interface AccountLayoutProps {
    children: React.ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <DashboardNav />
            <div className="flex pt-[72px]"> {/* Add padding-top to account for navbar height */}
                {/* Left Sidebar */}
                <div className="fixed left-0 w-64 h-[calc(100vh-72px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200 overflow-y-auto">
                    <nav className="p-6 space-y-2">
                        <NavLink 
                            href="/profile" 
                            icon="👤"
                            label="Profile"
                        />
                        <NavLink 
                            href="/settings"
                            icon="⚙️"
                            label="Settings" 
                        />
                    </nav>
                </div>

                {/* Main Content */}
                <div className="ml-64 flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

// NavLink component
const NavLink = ({ href, icon, label }: { href: string; icon: string; label: string }) => {
    const router = useRouter();
    const isActive = router.pathname === href;

    return (
        <Link 
            href={href}
            className={`
                flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                ${isActive 
                    ? 'bg-healing-500 text-white dark:bg-healing-600' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-healing-50 dark:hover:bg-healing-900/30'
                }
            `}
        >
            <span className="mr-3">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
};

export default AccountLayout;