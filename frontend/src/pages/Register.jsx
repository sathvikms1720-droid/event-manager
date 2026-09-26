import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        formData.full_name.trim(),
        formData.email.trim(),
        formData.phone.trim(),
        formData.password
      );

      // Registration successful → go to login
      navigate("/login", {
        state: {
          message: "Account created successfully. Please login.",
        },
      });
    } catch (err) {
      console.error("Registration failed:", err);

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Unable to create account. Please try again.";

      setError(
        Array.isArray(message)
          ? message[0]?.msg || "Registration failed."
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-[390px] bg-[#fffdfa] rounded-[38px] shadow-sm px-6 py-7">

        {/* Logo */}
        <div className="text-center mb-7">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full border-2 border-[#d99a3d] flex items-center justify-center relative">
              <span className="text-3xl font-serif text-[#c98527]">
                E
              </span>

              <span className="absolute -top-4 text-[#c98527] text-xl">
                ♛
              </span>
            </div>
          </div>

          <h1 className="text-[27px] font-serif text-[#5b321d]">
            Eventora
          </h1>

          <p className="text-[11px] tracking-[4px] text-[#a87851] mt-1">
            MANAGE. PLAN. CELEBRATE.
          </p>
        </div>

        {/* Heading */}
        <div className="mb-5">
          <h2 className="text-[25px] font-serif font-bold text-[#321b0e]">
            Create Account
          </h2>

          <p className="text-sm text-[#a47f68] mt-1">
            Let's get you started with your Eventora account.
          </p>
        </div>

        <form onSubmit={handleRegister}>

          {/* Full Name */}
          <div className="relative mb-3">
            <User
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d48b2e]"
            />

            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full h-[54px] rounded-[17px] bg-white px-12 text-sm text-[#321b0e] outline-none border border-transparent focus:border-[#e1a24b] shadow-sm"
            />
          </div>

          {/* Email */}
          <div className="relative mb-3">
            <Mail
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d48b2e]"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full h-[54px] rounded-[17px] bg-white px-12 text-sm text-[#321b0e] outline-none border border-transparent focus:border-[#e1a24b] shadow-sm"
            />
          </div>

          {/* Phone */}
          <div className="relative mb-3">
            <Phone
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d48b2e]"
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full h-[54px] rounded-[17px] bg-white px-12 text-sm text-[#321b0e] outline-none border border-transparent focus:border-[#e1a24b] shadow-sm"
            />
          </div>

          {/* Password */}
          <div className="relative mb-3">
            <Lock
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d48b2e]"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full h-[54px] rounded-[17px] bg-white px-12 pr-12 text-sm text-[#321b0e] outline-none border border-transparent focus:border-[#e1a24b] shadow-sm"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a89582]"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-4">
            <Lock
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d48b2e]"
            />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full h-[54px] rounded-[17px] bg-white px-12 pr-12 text-sm text-[#321b0e] outline-none border border-transparent focus:border-[#e1a24b] shadow-sm"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a89582]"
            >
              {showConfirmPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 text-xs text-[#806d5e] mb-5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-[2px] accent-[#d18a2d]"
            />

            <span>
              I agree to the{" "}
              <span className="text-[#d18426] font-medium">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-[#d18426] font-medium">
                Privacy Policy
              </span>
            </span>
          </label>

          {/* Error */}
          {error && (
            <div className="text-center text-sm text-red-500 mb-3">
              {error}
            </div>
          )}

          {/* Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[55px] rounded-[17px] bg-gradient-to-r from-[#cf8a2d] to-[#ebb45f] text-white font-semibold shadow-lg shadow-[#d69a45]/20 disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account  →"}
          </button>
        </form>

        {/* OR */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#eadccc]" />
          <span className="text-xs text-[#b18d73]">OR</span>
          <div className="flex-1 h-px bg-[#eadccc]" />
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full h-[50px] rounded-[15px] bg-white border border-[#eee2d4] text-sm font-medium text-[#321b0e] shadow-sm"
          onClick={() => {
            alert("Google login will be available soon.");
          }}
        >
          <span className="mr-2 font-bold text-[#4285F4]">G</span>
          Continue with Google
        </button>

        {/* Login */}
        <p className="text-center text-sm text-[#a17d68] mt-6">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#d18426] font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;