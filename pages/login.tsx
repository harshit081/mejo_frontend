import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                {error && (
                    <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
                
                {step === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center">Login</h2>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="w-full p-2 border rounded"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="w-full p-2 border rounded"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                        <div className="flex justify-between items-center">
                            <Link href="/forgot-password" className="text-blue-500 hover:text-blue-600">
                                Forgot Password?
                            </Link>
                            <Link href="/signup" className="text-blue-500 hover:text-blue-600">
                                Create Account
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className={`w-full p-2 ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded`}
                            disabled={loading}
                        >
                            {loading ? <div className="loader"></div> : "Login"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <h2 className="text-2xl font-bold text-center">Verify Email</h2>
                        <p className="text-center text-gray-600">
                            Enter the OTP sent to your email
                        </p>
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            className="w-full p-2 border rounded"
                            value={formData.otp}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <button
                            type="button"
                            onClick={handleSendOTP}
                            className="w-full p-2 bg-gray-200 text-gray-700 rounded"
                            disabled={loading}
                        >
                            Resend OTP
                        </button>
                    </form>
                )}
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
