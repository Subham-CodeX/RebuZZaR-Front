import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth(); // OR login()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/");
      return;
    }

    // ✅ store token
    localStorage.setItem("authToken", token);

    // ✅ reload app so AuthContext fetches user
    window.location.href = "/";
  }, []);

  return <p className="text-center mt-10">Logging you in…</p>;
};

export default GoogleAuthSuccess;
