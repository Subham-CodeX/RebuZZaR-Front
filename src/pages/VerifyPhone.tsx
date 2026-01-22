import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_BACKEND_URL;

const VerifyPhone = () => {
  const navigate = useNavigate();
  const { token, refreshUser } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Protect page if token missing
  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized! Please login again.");
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  const sendOtp = async (isResend = false) => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast.error("Enter a valid 10 digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/phone/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      toast.success(isResend ? "OTP resent ✅" : "OTP sent ✅");
      setOtpSent(true);
    } catch (err: any) {
      toast.error(err.message || "OTP send failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/phone/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verify failed");

      toast.success("Phone verified ✅ Welcome to RebuZZar!");
      await refreshUser();
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err.message || "OTP verify failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md border border-neutral-200">
        <h1 className="text-2xl font-bold text-neutral-800 text-center">
          Verify Your Phone ✅
        </h1>
        <p className="text-sm text-neutral-500 text-center mt-2">
          Mobile verification is mandatory to access RebuZZar.
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="text"
            maxLength={10}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter 10 digit mobile number"
            className="w-full px-4 py-2 border rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-700"
          />

          {!otpSent ? (
            <button
              onClick={() => sendOtp(false)}
              disabled={loading}
              className="w-full py-2 rounded-lg bg-neutral-800 text-white font-semibold hover:bg-neutral-900 disabled:bg-neutral-400"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border rounded-lg bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-700"
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-neutral-400"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              {/* ✅ NEW: Resend OTP button */}
              <button
                onClick={() => sendOtp(true)}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-neutral-800 text-white font-semibold hover:bg-neutral-900 disabled:bg-neutral-400"
              >
                {loading ? "Resending..." : "Resend OTP"}
              </button>

              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                className="w-full text-sm text-neutral-600 hover:underline"
              >
                Change Number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPhone;
