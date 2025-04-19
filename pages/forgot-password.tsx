import { useState } from "react";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"request" | "reset">("request");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("reset");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Reset request failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password reset successfully!");
        router.push("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        {step === "request" ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Requesting..." : "Request Reset"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Reset Password</h2>
            <input
              type="text"
              placeholder="Reset Token"
              className="w-full p-2 border rounded"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-2 border rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;