import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthNavbar } from './components/AuthNavbar';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Verify = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);
    const router = useRouter();

    // Get email from query parameters or localStorage
    useEffect(() => {
        const emailFromQuery = router.query.email as string;
        const emailFromStorage = localStorage.getItem('unverifiedEmail');
        
        if (emailFromQuery) {
            setEmail(emailFromQuery);
            localStorage.setItem('unverifiedEmail', emailFromQuery);
        } else if (emailFromStorage) {
            setEmail(emailFromStorage);
        }
    }, [router.query]);

    // Countdown timer for resend button
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Please enter your email address");
            return;
        }
        
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`${apiUrl}/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess("🎉 Email verified successfully! Redirecting to login page...");
                setError(null);
                localStorage.removeItem('unverifiedEmail');
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(data.message || "Verification failed. Please check your code and try again.");
            }
        } catch (error) {
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }
        
        setResendLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch(`${apiUrl}/api/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess("📧 New verification code sent to your email! Please check your inbox.");
                setError(null);
                setCanResend(false);
                setCountdown(60); // 60 second cooldown
            } else {
                setError(data.message || "Failed to resend verification code. Please try again.");
            }
        } catch (error) {
            setError("Network error. Please check your connection.");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cool-gradient dark:bg-cool-gradient-dark transition-colors duration-200">
            <AuthNavbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <div className="backdrop-blur-sm bg-white/90 dark:bg-cool-900/40 rounded-xl shadow-xl overflow-hidden p-8 transition-colors duration-200">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-cool-700 dark:text-cool-50">
                                Verify Your Email
                            </h2>
                            <p className="text-cool-600 dark:text-cool-100 mt-2">
                                Complete your account setup by verifying your email address
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/30 border-l-4 border-red-400 text-red-600 dark:text-red-300 rounded">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-green-50/80 dark:bg-green-900/30 border-l-4 border-green-400 text-green-600 dark:text-green-300 rounded">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-cool-700 dark:text-cool-50 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full p-3 border border-cool-300 dark:border-cool-600 rounded-lg 
                                    bg-white/90 dark:bg-cool-800/60 
                                    text-cool-800 dark:text-cool-50
                                    focus:outline-none focus:ring-2 focus:ring-cool-500 dark:focus:ring-cool-400
                                    placeholder-cool-400 dark:placeholder-cool-300
                                    hover:border-cool-400 dark:hover:border-cool-500
                                    transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading || resendLoading}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-cool-700 dark:text-cool-50 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    className="w-full p-3 border border-cool-300 dark:border-cool-600 rounded-lg 
                                    bg-white/90 dark:bg-cool-800/60 
                                    text-cool-800 dark:text-cool-50
                                    focus:outline-none focus:ring-2 focus:ring-cool-500 dark:focus:ring-cool-400
                                    placeholder-cool-400 dark:placeholder-cool-300
                                    hover:border-cool-400 dark:hover:border-cool-500
                                    transition-colors"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={loading || resendLoading}
                                    maxLength={6}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full p-3 rounded-lg text-white font-medium transition-all
                                    ${(loading || resendLoading)
                                        ? 'bg-cool-400/70 dark:bg-cool-600/50 cursor-not-allowed' 
                                        : 'bg-cool-600 hover:bg-cool-700 dark:bg-cool-500 dark:hover:bg-cool-400 shadow-md hover:shadow-lg active:scale-[0.99]'
                                    }`}
                                disabled={loading || resendLoading}
                            >
                                {loading ? (
                                    <div className="loader mx-auto"></div>
                                ) : (
                                    "Verify Email"
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-cool-600 dark:text-cool-100 text-sm mb-3">
                                Didn't receive the code?
                            </p>
                            <button
                                onClick={handleResendOTP}
                                className={`text-sm font-medium transition-colors ${
                                    (canResend && !resendLoading && !loading)
                                        ? 'text-cool-600 hover:text-cool-800 dark:text-cool-200 dark:hover:text-cool-50 cursor-pointer'
                                        : 'text-cool-400 dark:text-cool-500 cursor-not-allowed'
                                }`}
                                disabled={!canResend || resendLoading || loading}
                            >
                                {resendLoading ? (
                                    "Sending..."
                                ) : countdown > 0 ? (
                                    `Resend in ${countdown}s`
                                ) : (
                                    "Resend Code"
                                )}
                            </button>
                        </div>

                        <div className="mt-8 text-center border-t border-cool-200 dark:border-cool-700 pt-6">
                            <p className="text-cool-600 dark:text-cool-100 text-sm">
                                Already verified?{" "}
                                <Link 
                                    href="/login" 
                                    className="text-cool-600 hover:text-cool-800 dark:text-cool-200 
                                    dark:hover:text-cool-50 font-medium transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                            <p className="text-cool-600 dark:text-cool-100 text-sm mt-2">
                                Need a new account?{" "}
                                <Link 
                                    href="/signup" 
                                    className="text-cool-600 hover:text-cool-800 dark:text-cool-200 
                                    dark:hover:text-cool-50 font-medium transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verify;
