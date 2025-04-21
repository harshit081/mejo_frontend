import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import { AuthNavbar } from './components/AuthNavbar';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        otp: ""
    });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"login" | "verify">("login");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
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
                    await handleSendOTP();
                    setStep("verify");
                } else {
                    localStorage.setItem("token", data.token);
                    Cookies.set("token", data.token);
                    router.push("/dashboard");
                }
            } else {
                if (data.message === 'Please verify your email address before logging in') {
                    await handleSendOTP();
                    setStep("verify");
                } else {
                    setError(data.message);
                }
            }
        } catch (error) {
            setError("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    email: formData.email, 
                    otp: formData.otp 
                }),
            });
            const data = await res.json();

            if (res.ok) {
                alert("Email verified successfully!");
                setStep("login");
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("OTP verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/generate-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });
            if (!res.ok) {
                throw new Error("Failed to send OTP");
            }
        } catch (error) {
            setError("Failed to send OTP. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-healing-gradient">
            <AuthNavbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8">
                        <div className="mb-8 text-center">
                            <h2 className="text-3xl font-bold text-healing-500">Welcome Back</h2>
                            <p className="text-gray-500 mt-2">Take care of your mind, sign in to continue</p>
                        </div>
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                        {step === "login" ? (
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-healing-300"
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
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-healing-300"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <Link href="/forgot-password" className="text-healing-500 hover:text-healing-600">
                                        Forgot Password?
                                    </Link>
                                    <Link href="/signup" className="text-healing-500 hover:text-healing-600">
                                        Create Account
                                    </Link>
                                </div>
                                <button
                                    type="submit"
                                    className={`w-full p-3 rounded-lg text-white font-medium transition-colors
                                        ${loading ? 'bg-gray-400' : 'bg-healing-500 hover:bg-healing-600'}`}
                                    disabled={loading}
                                >
                                    {loading ? <div className="loader mx-auto"></div> : "Sign In"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-healing-500">Verify Email</h2>
                                    <p className="text-gray-500 mt-2">Enter the OTP sent to your email</p>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="otp"
                                        placeholder="Enter OTP"
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-healing-300"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full p-3 bg-healing-500 text-white rounded-lg font-medium transition-colors hover:bg-healing-600"
                                    disabled={loading}
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    className="w-full p-3 bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-300"
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

/* Add a simple loader style */
<style jsx>{`
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`}</style>
