import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../api/authService";
import LoginSuccessModal from "../components/LoginSuccessModal";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Crown,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Placeholder login handler — backend will be wired up later
const handleLogin = async () => {
  try {
    setIsLoading(true);

    const response = await loginUser(email, password);

    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("user", JSON.stringify(response.user));

    setShowSuccess(true);

  } catch (error) {

    alert(
      error.response?.data?.detail ||
      "Invalid Email or Password"
    );

  } finally {
    setIsLoading(false);
  }
};
  const handleGoogleLogin = () => {
    // Placeholder for Google auth
    console.log("Continue with Google clicked");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FBF7F0] font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-[390px] min-h-screen sm:min-h-0 sm:h-[844px] sm:rounded-[40px] sm:shadow-2xl bg-[#FBF7F0] overflow-hidden flex flex-col"
      >
        {/* ---------- Top Section ---------- */}
        <div className="relative pt-10 pb-6 px-6 overflow-hidden">
          {/* Decorative cream circle with image, top-right */}
          

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center mt-2"
          >
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Laurel leaves (left) */}
              <svg
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-9 h-16"
                viewBox="0 0 40 70"
                fill="none"
              >
                {[...Array(5)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx={30 - i * 3}
                    cy={10 + i * 12}
                    rx="10"
                    ry="5"
                    transform={`rotate(${-30 + i * 8} ${30 - i * 3} ${10 + i * 12})`}
                    fill="url(#goldLeafGrad)"
                  />
                ))}
                <defs>
                  <linearGradient id="goldLeafGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#C98A3A" />
                    <stop offset="100%" stopColor="#E7B56A" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Laurel leaves (right, mirrored) */}
              <svg
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-16 scale-x-[-1]"
                viewBox="0 0 40 70"
                fill="none"
              >
                {[...Array(5)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx={30 - i * 3}
                    cy={10 + i * 12}
                    rx="10"
                    ry="5"
                    transform={`rotate(${-30 + i * 8} ${30 - i * 3} ${10 + i * 12})`}
                    fill="url(#goldLeafGrad2)"
                  />
                ))}
                <defs>
                  <linearGradient id="goldLeafGrad2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#C98A3A" />
                    <stop offset="100%" stopColor="#E7B56A" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Crown above the E */}
              <Crown
                size={18}
                className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#C98A3A]"
                strokeWidth={1.8}
              />

              {/* Letter E */}
              <div className="w-14 h-14 rounded-full border-2 border-[#D9A757] flex items-center justify-center bg-white">
                <span
                  className="text-2xl font-serif bg-gradient-to-b from-[#C98A3A] to-[#E7B56A] bg-clip-text text-transparent"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  E
                </span>
              </div>
            </div>

            <h1
              className="mt-3 text-3xl text-[#4A3A2A] tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Eventora
            </h1>
            <p className="text-xs tracking-[0.25em] text-[#9C8A73] mt-1 uppercase">
              Manage. Plan. Celebrate.
            </p>
          </motion.div>
        </div>

        {/* ---------- Main Content ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex-1 px-6 pt-2 flex flex-col"
        >
          <h2
            className="text-2xl text-[#3B2F22] font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome Back!
          </h2>
          <p className="text-sm text-[#9C8A73] mt-1 mb-6">
            Login to continue to your account.
          </p>

          {/* Email Input */}
          <div
            className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 mb-4 shadow-[0_4px_16px_rgba(201,138,58,0.08)] border transition-all duration-300 ${
              emailFocused
                ? "border-[#D9A757] shadow-[0_0_0_4px_rgba(217,167,87,0.15)]"
                : "border-transparent"
            }`}
          >
            <Mail size={18} className="text-[#C98A3A] shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="Email Address"
              className="flex-1 bg-transparent outline-none text-sm text-[#3B2F22] placeholder:text-[#B3A48F]"
            />
          </div>

          {/* Password Input */}
          <div
            className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-[0_4px_16px_rgba(201,138,58,0.08)] border transition-all duration-300 ${
              passwordFocused
                ? "border-[#D9A757] shadow-[0_0_0_4px_rgba(217,167,87,0.15)]"
                : "border-transparent"
            }`}
          >
            <Lock size={18} className="text-[#C98A3A] shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Password"
              className="flex-1 bg-transparent outline-none text-sm text-[#3B2F22] placeholder:text-[#B3A48F]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-[#B3A48F] shrink-0"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mt-2 mb-6">
            <button
              type="button"
              className="text-xs font-medium text-[#C98A3A] hover:text-[#A9702A] transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            disabled={isLoading}
            className="relative overflow-hidden w-full py-4 rounded-2xl bg-gradient-to-r from-[#C98A3A] to-[#E7B56A] shadow-[0_8px_20px_rgba(201,138,58,0.35)] flex items-center justify-center gap-2 group disabled:opacity-80"
          >
            {isLoading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
            ) : (
              <>
                <span className="text-white font-medium text-sm tracking-wide">
                  Login
                </span>
                <ArrowRight
                  size={18}
                  className="text-white transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E6DCC9]" />
            <span className="text-xs text-[#B3A48F] tracking-wide">OR</span>
            <div className="flex-1 h-px bg-[#E6DCC9]" />
          </div>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            className="w-full py-3.5 rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-center gap-2.5 border border-[#F0E9DA]"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4C29.4 34.9 26.8 36 24 36c-5.3 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.5 5.4C40.5 36.5 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
              />
            </svg>
            <span className="text-sm font-medium text-[#3B2F22]">
              Continue with Google
            </span>
          </motion.button>

          {/* Register Link */}
          <p className="text-center text-sm text-[#9C8A73] mt-6">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#C98A3A] font-semibold hover:text-[#A9702A] transition-colors"
            >
              Register
            </button>
          </p>
        </motion.div>

        {/* ---------- Footer illustration ---------- */}
        <div className="relative h-24 mt-4 shrink-0">
          <svg
            viewBox="0 0 390 100"
            className="absolute bottom-0 w-full h-full text-[#E7B56A] opacity-40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            {/* String lights */}
            <path d="M0 8 Q97.5 28 195 8 T390 8" strokeWidth="1" />
            {[...Array(11)].map((_, i) => (
              <circle key={i} cx={i * 39} cy={8 + Math.sin(i) * 6} r="2" fill="currentColor" />
            ))}

            {/* Center archway */}
            <path d="M160 100 V55 Q160 30 195 30 Q230 30 230 55 V100" />
            <path d="M170 100 V60 Q170 40 195 40 Q220 40 220 60 V100" />

            {/* Left topiary trees */}
            <line x1="90" y1="100" x2="90" y2="65" />
            <circle cx="90" cy="55" r="12" />
            <circle cx="78" cy="65" r="8" />
            <circle cx="102" cy="65" r="8" />

            {/* Right topiary trees */}
            <line x1="300" y1="100" x2="300" y2="65" />
            <circle cx="300" cy="55" r="12" />
            <circle cx="288" cy="65" r="8" />
            <circle cx="312" cy="65" r="8" />

            {/* Tables left */}
            <ellipse cx="40" cy="88" rx="16" ry="5" />
            <line x1="40" y1="88" x2="40" y2="100" />
            <circle cx="30" cy="80" r="3" />
            <circle cx="50" cy="80" r="3" />

            {/* Tables right */}
            <ellipse cx="350" cy="88" rx="16" ry="5" />
            <line x1="350" y1="88" x2="350" y2="100" />
            <circle cx="340" cy="80" r="3" />
            <circle cx="360" cy="80" r="3" />
          </svg>
        </div>
      </motion.div>
      <LoginSuccessModal
  open={showSuccess}
  onClose={() => {
    setShowSuccess(false);
    navigate("/dashboard");
  }}
/>
    </div>
  );
};

export default Login;