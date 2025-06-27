import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthNavbar } from './components/AuthNavbar';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ForgotPassword = () => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [formData, setFormData] = useState({
    email: '',
    resetToken: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/api/auth/reset-password-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password reset instructions have been sent to your email!");
        setStep('reset');
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resetToken: formData.resetToken, 
          newPassword: formData.newPassword 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password reset successfully! You can now log in with your new password.");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-healing-50 dark:bg-gray-900 transition-colors duration-200">
      <AuthNavbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden p-8 transition-colors duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-healing-700 dark:text-healing-100">
                {step === 'email' ? 'Forgot Password' : 'Reset Password'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {step === 'email' 
                  ? 'Enter your email to receive reset instructions' 
                  : 'Enter the reset token from your email and your new password'
                }
              </p>
            </div>

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

            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-healing-500 focus:border-healing-500 transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-healing-500 text-white font-medium hover:bg-healing-600 focus:ring-2 focus:ring-healing-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reset Token
                  </label>
                  <input
                    type="text"
                    name="resetToken"
                    value={formData.resetToken}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-healing-500 focus:border-healing-500 transition-colors"
                    placeholder="Enter reset token from email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-healing-500 focus:border-healing-500 transition-colors"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-healing-500 focus:border-healing-500 transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-healing-500 text-white font-medium hover:bg-healing-600 focus:ring-2 focus:ring-healing-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-healing-600 dark:text-healing-400 hover:text-healing-700 dark:hover:text-healing-300 font-medium transition-colors">
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
