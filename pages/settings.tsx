import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from './utils/withAuth';
import AccountLayout from '../components/AccountLayout';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface UserSettings {
    preferences: {
        emailNotifications: boolean;
    };
}

const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [settings, setSettings] = useState<UserSettings>({
        preferences: {
            emailNotifications: true
        }
    });

    const { theme, setTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${apiUrl}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch settings');
            }

            const data = await response.json();
            if (data.preferences) {
                setSettings({ preferences: data.preferences });
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to load settings');
            console.error('Settings fetch error:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get('token');
            if (!token) {
                router.push('/login');
                return;
            }

            console.log("Updating settings:", settings); // Debug log

            const response = await fetch(`${apiUrl}/api/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    preferences: settings.preferences
                }),
                credentials: 'include'
            });

            console.log("Settings update response status:", response.status); // Debug log

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update settings');
            }

            const data = await response.json();
            console.log("Updated settings response:", data); // Debug log
            setSuccess('Settings updated successfully!');
        } catch (error) {
            console.error("Settings update error:", error); // Debug log
            setError(error instanceof Error ? error.message : 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (name: string, value: boolean) => {
        setSettings(prev => ({
            preferences: {
                ...prev.preferences,
                [name]: value
            }
        }));
    };

    return (
        <AccountLayout>
            <div className="max-w-2xl p-6">
                <motion.div 
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Settings</h1>
                    
                    {error && (
                        <motion.div 
                            className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div 
                            className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {success}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Notifications
                                </label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.preferences.emailNotifications}
                                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-healing-300 dark:peer-focus:ring-healing-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-healing-500"></div>
                                </label>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Theme
                                </label>
                                <select
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-healing-300 dark:focus:ring-healing-700 focus:border-healing-500 dark:focus:border-healing-700"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full px-4 py-2 bg-healing-500 text-white rounded-lg hover:bg-healing-600 dark:hover:bg-healing-400 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600"
                        >
                            {loading ? <div className="loader mx-auto" /> : 'Save Settings'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </AccountLayout>
    );
};

export default withAuth(Settings);