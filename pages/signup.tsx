import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthNavbar } from './components/AuthNavbar';
import { ThemeToggle } from '../components/ThemeToggle';

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
    <div className="min-h-screen bg-cool-gradient dark:bg-cool-gradient-dark transition-colors duration-200">
      <AuthNavbar />
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="backdrop-blur-sm bg-white/90 dark:bg-cool-900/40 rounded-xl shadow-xl overflow-hidden p-8 transition-colors duration-200">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-cool-700 dark:text-cool-50">Begin Your Journey</h2>
              <p className="text-cool-600 dark:text-cool-100 mt-2">Join our community of mindful individuals</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/30 border-l-4 border-red-400 text-red-600 dark:text-red-300 rounded">
                {error}
              </div>
            )}

            {step === "signup" ? (
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 border border-cool-300 dark:border-cool-600 rounded-lg 
                    bg-white/90 dark:bg-cool-800/60 
                    text-cool-800 dark:text-cool-50
                    focus:outline-none focus:ring-2 focus:ring-cool-500 dark:focus:ring-cool-400
                    placeholder-cool-400 dark:placeholder-cool-300
                    hover:border-cool-400 dark:hover:border-cool-500
                    transition-colors"
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
                    className="w-full p-3 border border-cool-300 dark:border-cool-600 rounded-lg 
                    bg-white/90 dark:bg-cool-800/60 
                    text-cool-800 dark:text-cool-50
                    focus:outline-none focus:ring-2 focus:ring-cool-500 dark:focus:ring-cool-400
                    placeholder-cool-400 dark:placeholder-cool-300
                    hover:border-cool-400 dark:hover:border-cool-500
                    transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-cool-600 dark:text-cool-100">
                    Already have an account?{" "}
                    <Link 
                      href="/login" 
                      className="text-cool-600 hover:text-cool-800 dark:text-cool-200 
                      dark:hover:text-cool-50 font-medium transition-colors"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
                <button
                  type="submit"
                  className={`w-full p-3 rounded-lg text-white font-medium transition-all
                    ${loading 
                      ? 'bg-cool-400/70 dark:bg-cool-600/50 cursor-not-allowed' 
                      : 'bg-cool-600 hover:bg-cool-700 dark:bg-cool-500 dark:hover:bg-cool-400 shadow-md hover:shadow-lg active:scale-[0.99]'
                    }`}
                  disabled={loading}
                >
                  {loading ? <div className="loader mx-auto"></div> : "Sign Up"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-cool-700 dark:text-cool-50">
                    Verify Your Email
                  </h3>
                  <p className="text-cool-600 dark:text-cool-100 mt-2">
                    We've sent a verification code to your email
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Enter verification code"
                    className="w-full p-3 border border-cool-300 dark:border-cool-600 rounded-lg 
                    bg-white/90 dark:bg-cool-800/60 
                    text-cool-800 dark:text-cool-50
                    focus:outline-none focus:ring-2 focus:ring-cool-500 dark:focus:ring-cool-400
                    placeholder-cool-400 dark:placeholder-cool-300
                    hover:border-cool-400 dark:hover:border-cool-500
                    transition-colors"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full p-3 rounded-lg text-white font-medium transition-all
                    ${loading 
                      ? 'bg-cool-400/70 dark:bg-cool-600/50 cursor-not-allowed' 
                      : 'bg-cool-600 hover:bg-cool-700 dark:bg-cool-500 dark:hover:bg-cool-400 shadow-md hover:shadow-lg active:scale-[0.99]'
                    }`}
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
