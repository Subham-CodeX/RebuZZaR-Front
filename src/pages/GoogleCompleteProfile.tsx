import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_BACKEND_URL;

const GoogleCompleteProfile = () => {
  const navigate = useNavigate();
  const { token, login } = useAuth();

  const [loading, setLoading] = useState(false);

  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");

  // Profile fields
  const [name, setName] = useState("");
  const [programType, setProgramType] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [studentCode, setStudentCode] = useState("");

  // ✅ NEW: Password step for Google users (to enable Email login too)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSet, setPasswordSet] = useState(false);

  // Department options per program (same as Login.tsx)
  const departmentOptions: Record<string, string[]> = {
    Diploma: [
      "Allied Health Sciences",
      "Civil Engineering",
      "Computer Science & Engineering",
      "Electronics & Communication Engineering",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Nursing",
      "Pharmaceutical Technology",
    ],
    UG: [
      "Agriculture",
      "Allied Health Sciences",
      "Biotechnology",
      "Commerce",
      "Computational Science",
      "Computer Science & Engineering",
      "Computer Science & Engineering CS & DS",
      "Computer Science and Engineering AI",
      "Cyber Science & Technology",
      "Electrical Engineering",
      "Electronics & Communication Engineering",
      "English & Literary Studies",
      "Food & Nutrition",
      "Hospital Management",
      "Law",
      "Management",
      "Media Science & Journalism",
      "Mechanical Engineering",
      "Multimedia",
      "Nursing",
      "Pharmaceutical Technology",
      "Psychology",
    ],
    PG: [
      "Agriculture",
      "Allied Health Sciences",
      "Biotechnology",
      "Commerce",
      "Computational Science",
      "Computer Science & Engineering",
      "Computer Science & Engineering CS & DS",
      "Computer Science and Engineering AI",
      "Cyber Science & Technology",
      "Electronics & Communication Engineering",
      "English & Literary Studies",
      "Food & Nutrition",
      "Hospital Management",
      "Law",
      "Management",
      "Mathematics",
      "Media Science & Journalism",
      "Mechanical Engineering",
      "Multimedia",
      "Nursing",
      "Pharmaceutical Technology",
      "Psychology",
    ],
    PhD: [
      "Biotechnology",
      "Commerce",
      "Computational Sciences",
      "Computer Science & Engineering",
      "Electronics & Communication Engineering",
      "English & Literary Studies",
      "Hospital Management",
      "Law",
      "Management",
      "Mathematics",
      "Pharmaceutical Technology",
    ],
  };

  // ✅ Protect page if token missing
  useEffect(() => {
    if (!token) {
      toast.error("Unauthorized! Please login again.");
      navigate("/");
    }
  }, [token, navigate]);

  // ✅ Send OTP automatically when page loads
  useEffect(() => {
    const sendOtp = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const res = await fetch(`${API}/api/auth/google/send-otp`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to send OTP");

        setOtpSent(true);
        toast.success("OTP sent to your university email ✅");
      } catch (err: any) {
        toast.error(err.message || "Failed to send OTP");
      } finally {
        setLoading(false);
      }
    };

    if (!otpSent) sendOtp();
  }, [token, otpSent]);

  // ✅ Resend OTP (NO reload ✅)
  const handleResendOtp = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/google/send-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      toast.success("OTP resent to your university email ✅");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      return toast.error("Please enter valid 6 digit OTP");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/google/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      setOtpVerified(true);
      toast.success("OTP verified successfully ✅");
    } catch (err: any) {
      toast.error(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Complete Profile
  const handleCompleteProfile = async () => {
    if (!otpVerified) {
      return toast.error("Please verify OTP first!");
    }

    if (!programType || !department || !year) {
      return toast.error("Program Type, Department and Year are required!");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/google/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          programType,
          department,
          year,
          studentCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Profile completion failed");

      toast.success("Profile completed successfully ✅");

      // ✅ Save user in context (but keep onboarding until password set)
      login(data.user, token!);

      // ✅ Show "Set Password" section next
      toast.success("Now set password to enable Email Login ✅");
    } catch (err: any) {
      toast.error(err.message || "Profile completion failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Set Password (Enable Email Login for Google users)
  const handleSetPassword = async () => {
    if (!password || password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return toast.error("Password and Confirm Password do not match");
    }

    if (!token) {
      return toast.error("Unauthorized! Please login again.");
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/auth/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to set password");

      setPasswordSet(true);
      toast.success("Password set successfully ✅ Email login enabled!");

      // ✅ Now user is fully onboarded - go home
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full px-4 py-2 border border-neutral-400 rounded-md bg-neutral-100 text-neutral-700 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700 focus:border-neutral-700";

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-neutral-800 text-center">
          Complete Your Profile
        </h2>
        <p className="text-sm text-neutral-500 text-center mt-2">
          OTP verification and student details are mandatory for Google login.
        </p>

        {/* OTP SECTION */}
        <div className="mt-6 space-y-3">
          <h3 className="text-base font-semibold text-neutral-700">
            Step 1: Verify OTP
          </h3>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full tracking-[6px] text-center text-lg font-semibold px-4 py-2 border border-neutral-400 rounded-lg bg-neutral-100 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-700"
            placeholder="------"
          />

          <button
            onClick={handleVerifyOtp}
            disabled={!otpSent || otpVerified || loading}
            className="w-full py-2 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-900 disabled:bg-neutral-400"
          >
            {otpVerified
              ? "OTP Verified ✅"
              : loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

          <button
            onClick={handleResendOtp}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-neutral-200 text-neutral-800 font-medium hover:bg-neutral-300 disabled:bg-neutral-100"
          >
            Resend OTP
          </button>
        </div>

        {/* PROFILE SECTION */}
        <div className="mt-8 space-y-3 border-t pt-6">
          <h3 className="text-base font-semibold text-neutral-700">
            Step 2: Fill Student Details
          </h3>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputStyle}
          />

          {/* Program Type */}
          <Select
            options={[
              { value: "Diploma", label: "Diploma" },
              { value: "UG", label: "Undergraduate (UG)" },
              { value: "PG", label: "Postgraduate (PG)" },
              { value: "PhD", label: "Doctorate (PhD)" },
            ]}
            value={
              programType ? { value: programType, label: programType } : null
            }
            onChange={(option) => {
              setProgramType(option?.value || "");
              setDepartment("");
            }}
            placeholder="Select Program Type *"
            className="w-full"
            classNamePrefix="react-select"
            isSearchable
          />

          {/* Department */}
          {programType && (
            <Select
              options={departmentOptions[programType].map((dept) => ({
                value: dept,
                label: dept,
              }))}
              value={
                department ? { value: department, label: department } : null
              }
              onChange={(option) => setDepartment(option?.value || "")}
              placeholder="Select Department *"
              className="w-full"
              classNamePrefix="react-select"
              isSearchable
            />
          )}

          {/* Year */}
          <Select
            options={[
              { value: "1st", label: "1st Year" },
              { value: "2nd", label: "2nd Year" },
              { value: "3rd", label: "3rd Year" },
              { value: "4th", label: "4th Year" },
              { value: "5th", label: "5th Year" },
            ]}
            value={year ? { value: year, label: year } : null}
            onChange={(option) => setYear(option?.value || "")}
            placeholder="Select Year *"
            className="w-full"
            classNamePrefix="react-select"
            isSearchable
          />

          {/* Student Code optional */}
          <input
            type="text"
            placeholder="Student Code (optional)"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            className={inputStyle}
          />

          <button
            onClick={handleCompleteProfile}
            disabled={loading || !otpVerified}
            className="w-full py-2 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-900 disabled:bg-neutral-400"
          >
            {loading ? "Submitting..." : "Complete Profile"}
          </button>
        </div>

        {/* ✅ NEW PASSWORD SECTION */}
        <div className="mt-8 space-y-3 border-t pt-6">
          <h3 className="text-base font-semibold text-neutral-700">
            Step 3: Set Password (Enable Email Login)
          </h3>

          <input
            type="password"
            placeholder="Set Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputStyle}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputStyle}
          />

          <button
            onClick={handleSetPassword}
            disabled={loading || passwordSet}
            className="w-full py-2 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-900 disabled:bg-neutral-400"
          >
            {passwordSet ? "Password Set ✅" : loading ? "Saving..." : "Set Password"}
          </button>

          <p className="text-xs text-neutral-500 text-center">
            After setting password, you can login using Email + Password too.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-5 w-full text-sm text-neutral-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default GoogleCompleteProfile;
