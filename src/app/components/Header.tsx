import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";

const shopIconPath =
  "M5.54877 55.4877H49.9389C52.9908 55.4877 55.4877 52.9908 55.4877 49.9389V13.8719H44.1405C42.8129 6.01209 35.9755 0 27.7439 0C19.5123 0 12.6748 6.01209 11.3486 13.8719H0V49.9389C0 52.9908 2.49695 55.4877 5.54877 55.4877ZM27.7439 5.54877C32.9028 5.54877 37.2392 9.09305 38.4766 13.8719H17.0111C18.2485 9.09305 22.5849 5.54877 27.7439 5.54877ZM11.0975 19.4207V24.9695H16.6463V19.4207H38.8414V24.9695H44.3902V19.4207H49.9389V49.9389H5.54877V19.4207H11.0975Z";

// Asterisk/star logo rotations per page
const pageRotations: Record<string, number> = {
  "/": 0,
  "/manual": -15,
  "/playground": -30,
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [rotation, setRotation] = useState(pageRotations[location.pathname] ?? 0);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      setRotation((prev) => prev + 360 + (pageRotations[location.pathname] ?? 0) - (pageRotations[prevPath.current] ?? 0));
      prevPath.current = location.pathname;
    }
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const isManual = location.pathname === "/manual";
  const isPlayground = location.pathname === "/playground";

  const textColor = isPlayground ? "text-black" : "text-white";
  const headerBg = isPlayground ? "bg-[#f7fade]" : "bg-black/25";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 ${headerBg} backdrop-blur-sm`}>
        <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-[1400px] mx-auto">
          {/* Left: Logo + Shop */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className={`font-['Space_Grotesk'] text-xl md:text-2xl ${textColor} cursor-pointer bg-transparent border-none`}>
              Daziy
            </button>
            <button
              onClick={() => setShowEmailPopup(!showEmailPopup)}
              className="relative bg-transparent border-none cursor-pointer p-1"
              style={{ transform: "rotate(18deg)" }}
            >
              <svg width="28" height="28" viewBox="0 0 55.4877 55.4877" fill="none">
                <path d={shopIconPath} fill={isPlayground ? "black" : "white"} />
              </svg>
            </button>
          </div>

          {/* Center: Asterisk Logo */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
            animate={{ rotate: rotation }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <AsteriskLogo color={isPlayground ? "#333" : "white"} />
          </motion.div>

          {/* Right: Nav */}
          <nav className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => navigate("/manual")}
              className={`bg-transparent border-none cursor-pointer text-sm md:text-base ${isManual ? "font-bold" : ""} ${textColor}`}
            >
              Manual
            </button>
            <button
              onClick={() => navigate("/playground")}
              className={`bg-transparent border-none cursor-pointer text-sm md:text-base ${isPlayground ? "font-bold" : ""} ${textColor}`}
            >
              Playground
            </button>
          </nav>
        </div>
      </header>

      {/* Email Popup */}
      <AnimatePresence>
        {showEmailPopup && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="fixed top-16 left-4 md:left-20 z-[60] bg-white rounded-2xl shadow-xl p-5 w-72"
          >
            <div className="absolute -top-2 left-8 w-4 h-4 bg-white rotate-45" />
            {!submitted ? (
              <>
                <p className="text-sm text-gray-800 mb-3">Stay in the loop! Drop your email and we'll keep you posted 🎸</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-black"
                  />
                  <button
                    onClick={() => { if (email) setSubmitted(true); }}
                    className="px-3 py-2 bg-black text-white rounded-lg text-sm cursor-pointer"
                  >
                    →
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-800">Thanks! We'll be in touch ✨</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {showEmailPopup && (
        <div className="fixed inset-0 z-[55]" onClick={() => setShowEmailPopup(false)} />
      )}
    </>
  );
}

function AsteriskLogo({ color = "white" }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      {/* 4 bars forming asterisk */}
      <rect x="14" y="2" width="4" height="28" rx="2" fill={color} />
      <rect x="14" y="2" width="4" height="28" rx="2" fill={color} transform="rotate(45 16 16)" />
      <rect x="14" y="2" width="4" height="28" rx="2" fill={color} transform="rotate(90 16 16)" />
      <rect x="14" y="2" width="4" height="28" rx="2" fill={color} transform="rotate(135 16 16)" />
    </svg>
  );
}