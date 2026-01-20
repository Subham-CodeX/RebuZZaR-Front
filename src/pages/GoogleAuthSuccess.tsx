import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_BACKEND_URL;

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        toast.error("Google login failed!");
        return navigate("/");
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
          return navigate("/google-complete-profile");
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        // ✅ If ok, login user in context and go home
        login(data.user, token);
        toast.success("Google login successful ✅");
        navigate("/");
      } catch (err: any) {
        console.error("GoogleAuthSuccess error:", err);
        toast.error(err.message || "Google login failed!");
        navigate("/");
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
