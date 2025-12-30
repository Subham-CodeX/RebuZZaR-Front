import React, { useEffect } from "react";
import "../styles/welcomepopup.css";

type WelcomePopupProps = {
  onClose: () => void;
  userName?: string;
};

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose, userName }) => {
  // Disable background scroll while popup is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="welcome-overlay">
      <div className="welcome-popup animate-welcome">
        <h2 className="welcome-title">
          👋 Welcome{userName ? `, ${userName}` : ""}!
        </h2>

        <p className="welcome-text">
          Welcome to <strong>RebuZZar</strong> 🎉  
          Buy & sell educational goods with students from your campus.
        </p>

        <ul className="welcome-points">
          <li>🛒 Sell your unused items</li>
          <li>📚 Find affordable study materials</li>
          <li>🤝 Connect with verified students</li>
        </ul>

        <button className="welcome-btn" onClick={onClose}>
          Get Started 🚀
        </button>
      </div>
    </div>
  );
};

export default WelcomePopup;
