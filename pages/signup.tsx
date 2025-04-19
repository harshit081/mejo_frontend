import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthNavbar } from './components/AuthNavbar';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("verify");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Email verified successfully!");
        router.push("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mindful-gradient">
      <AuthNavbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-mindful-500">Begin Your Journey</h2>
              <p className="text-gray-500 mt-2">Join our community of mindful individuals</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {step === "signup" ? (
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mindful-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mindful-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-mindful-500 hover:text-mindful-600">
                      Sign In
                    </Link>
                  </p>
                </div>
                <button
                  type="submit"
                  className={`w-full p-3 rounded-lg text-white font-medium transition-colors
                    ${loading ? 'bg-gray-400' : 'bg-mindful-500 hover:bg-mindful-600'}`}
                  disabled={loading}
                >
                  {loading ? <div className="loader mx-auto"></div> : "Sign Up"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-mindful-500">Verify Your Email</h3>
                  <p className="text-gray-500 mt-2">
                    We've sent a verification code to your email
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-mindful-300"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full p-3 rounded-lg text-white font-medium transition-colors
                    ${loading ? 'bg-gray-400' : 'bg-mindful-500 hover:bg-mindful-600'}`}
                  disabled={loading}
                >
                  {loading ? <div className="loader mx-auto"></div> : "Verify Email"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
