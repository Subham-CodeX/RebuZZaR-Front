// src/components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType(); // PUSH | POP | REPLACE

  useEffect(() => {
    // ✅ Always go top when route changes (including Back button on mobile)
    // POP = browser back/forward
    if (navigationType === "POP") {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, navigationType]);

  return null; // this component doesn’t render anything visible
};

export default ScrollToTop;
