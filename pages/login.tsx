import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import { AuthNavbar } from './components/AuthNavbar';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from 'next-themes';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
    const router = useRouter();
    const { setTheme } = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
        setUnverifiedEmail(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Use the environment variable for API URL
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: formData.email, 
                    password: formData.password 
                }),
            });
            const data = await res.json();

            if (res.ok) {
                if (!data.user.isVerified) {
                    localStorage.setItem('unverifiedEmail', formData.email);
                    router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
                } else {
                    localStorage.setItem("token", data.token);
                    Cookies.set("token", data.token);

                    if (data.user.preferences?.theme) {
                        setTheme(data.user.preferences.theme);
                    }

                    router.push("/dashboard");
                }
            } else {
                if (data.type === 'unverified_email') {
                    setError(`Please verify your email address before logging in.`);
                    setUnverifiedEmail(data.email || formData.email);
                    localStorage.setItem('unverifiedEmail', data.email || formData.email);
                } else {
                    setError(data.message);
                    setUnverifiedEmail(null);
                }
            }
        } catch (error) {
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cool-gradient dark:bg-cool-gradient-dark transition-colors duration-200">
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900 dark:to-black transition-colors duration-200">
                <AuthNavbar />
                <div className="pt-24 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white dark:bg-teal-900/30 rounded-xl shadow-xl overflow-hidden p-8 transition-colors duration-200">
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl font-bold text-teal-500 dark:text-teal-100">Welcome Back</h2>
                                <p className="text-gray-500 dark:text-teal-50/70 mt-2">Take care of your mind, sign in to continue</p>
                            </div>
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 text-red-700 dark:text-red-400 rounded">
                                    <div className="mb-2">{error}</div>
                                    {unverifiedEmail && (
                                        <div className="mt-3">
                                            <Link 
                                                href={`/verify?email=${encodeURIComponent(unverifiedEmail)}`}
                                                className="inline-flex items-center px-3 py-1 bg-teal-500 hover:bg-teal-600 text-white text-sm rounded-md transition-colors"
                                            >
                                                Verify Email Now
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="w-full p-3 border border-teal-100 dark:border-teal-600 rounded-lg 
                                        bg-white dark:bg-teal-900/40 text-gray-900 dark:text-teal-50
                                        focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-100"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="w-full p-3 border border-teal-100 dark:border-teal-600 rounded-lg 
                                        bg-white dark:bg-teal-900/40 text-gray-900 dark:text-teal-50
                                        focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-100"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <Link href="/signup" className="text-teal-500 hover:text-teal-600 dark:text-teal-100 dark:hover:text-teal-50">
                                        Create Account
                                    </Link>
                                    <Link href="/verify" className="text-teal-500 hover:text-teal-600 dark:text-teal-100 dark:hover:text-teal-50">
                                        Verify Email
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full p-3 rounded-lg text-white font-medium transition-colors
                                        ${loading ? 'bg-gray-400 dark:bg-gray-600' : 'bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500'}`}
                                    disabled={loading}
                                >
                                    {loading ? <div className="loader mx-auto"></div> : "Sign In"}
                                </button>
                                
                                {/* Forgot Password Link */}
                                <div className="text-center space-y-2">
                                    <Link href="/forgot-password" className="text-teal-600 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-200 text-sm font-medium transition-colors">
                                        Forgot your password?
                                    </Link>
                                </div>
                                
                                {/* Help for unverified users */}
                                <div className="text-center border-t border-teal-200 dark:border-teal-700 pt-4 mt-6">
                                    <p className="text-sm text-gray-600 dark:text-teal-200 mb-2">
                                        Having trouble signing in?
                                    </p>
                                    <Link 
                                        href="/verify" 
                                        className="text-teal-600 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-200 text-sm font-medium transition-colors"
                                    >
                                        Verify your email address
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

/* Update loader style */
<style jsx>{`
  .loader {
    border: 4px solid rgba(178, 216, 216, 0.3);
    border-top: 4px solid #b2d8d8;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>
