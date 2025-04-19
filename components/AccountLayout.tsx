import { useRouter } from 'next/router';
import { DashboardNav } from '../pages/components/DashboardNav';
import { motion } from 'framer-motion';

interface AccountLayoutProps {
    children: React.ReactNode;
}

const AccountLayout = ({ children }: AccountLayoutProps) => {
    const router = useRouter();
    const currentPath = router.pathname;

    const menuItems = [
        { 
            icon: '👤',
            label: 'Profile',
            path: '/profile',
        },
        {
            icon: '⚙️',
            label: 'Settings',
            path: '/settings',
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-healing-100">
            <DashboardNav />
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Vertical Navigation */}
                    <motion.div 
                        className="w-64 shrink-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {menuItems.map((item) => (
                                <motion.button
                                    key={item.path}
                                    onClick={() => router.push(item.path)}
                                    className={`w-full px-6 py-4 flex items-center gap-3 text-left transition-all
                                        ${currentPath === item.path 
                                            ? 'bg-healing-50 text-healing-700 border-l-4 border-healing-500' 
                                            : 'text-gray-600 hover:bg-gray-50'}`}
                                    whileHover={{ x: 4 }}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div 
                        className="flex-1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AccountLayout;