import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_BACKEND_URL;

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Prevent double execution (React 18 StrictMode runs useEffect twice in dev)
  const hasRun = useRef(false);

  useEffect(() => {
    // ✅ block second run
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      // ✅ If no token, silently redirect home (NO wrong toast)
      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      // ✅ Store token
      localStorage.setItem("authToken", token);

      try {
        // ✅ Check user status from backend
        const res = await fetch(`${API}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ If OTP not verified OR profile incomplete → go to complete profile page
        if (res.status === 403) {
          navigate("/google-complete-profile", { replace: true });
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        // ✅ login user in context and go home
        login(data.user, token);

        toast.success("Google login successful ✅");
        navigate("/", { replace: true });
      } catch (err: any) {
        console.error("GoogleAuthSuccess error:", err);

        // ✅ Only show error if something REALLY failed
        toast.error(err.message || "Google login failed!");

        navigate("/", { replace: true });
      }
    };

    run();
  }, [navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <p className="text-neutral-700 font-medium">Logging you in…</p>
    </div>
  );
};

export default GoogleAuthSuccess;
