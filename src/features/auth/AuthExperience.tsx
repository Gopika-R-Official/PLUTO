"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";
import { setAuthUser } from "@/store/slices/authSlice";
import { setDisplayName } from "@/store/slices/preferencesSlice";
import { toast } from "@/components/ui/Toast";
import { CultureWall } from "@/components/ui/CultureWall";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface AuthExperienceProps {
  initialMode: "login" | "signup";
}

export function AuthExperience({ initialMode }: AuthExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && themeMode === "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Unified mode state: toggles smoothly without remounting or losing form values
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  // Form State (shared across tabs to never lose user input)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync mode with URL if path changed externally
  useEffect(() => {
    if (pathname.includes("/signup") && mode !== "signup") {
      setMode("signup");
    } else if (pathname.includes("/login") && mode !== "login") {
      setMode("login");
    }
  }, [pathname]);

  const switchMode = (newMode: "login" | "signup") => {
    if (newMode === mode) return;
    setErrorMessage(null);
    setMode(newMode);
    // Smooth URL update without page reload
    if (typeof window !== "undefined") {
      const url = newMode === "login" ? "/login" : "/signup";
      window.history.pushState(null, "", url);
    }
  };

  // Password Validation Rules for Signup
  const passwordRules = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumberOrSymbol: /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };
  }, [password]);

  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.hasUpper &&
    passwordRules.hasNumberOrSymbol;

  // Demo Credentials autofill
  const fillDemo = () => {
    setEmail("alex@pluto.culture");
    setPassword("PlutoCulture2026!");
    setName("Alex Rao");
    setErrorMessage(null);
    toast.info("Filled demo credentials for Alex Rao");
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast.info("Please enter your email address to receive a reset link.");
      return;
    }
    toast.success(`Password reset link sent to ${email}`);
  };

  const handleSocialAuth = (provider: string) => {
    toast.info(`Connecting with ${provider}...`);
    setIsLoading(true);
    setTimeout(() => {
      // Simulate successful social auth
      const mockUser = {
        id: `user-social-${Date.now()}`,
        email: email || `user@${provider.toLowerCase()}.com`,
        name: name || "Culture Explorer",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio: `Member via ${provider}`,
        createdAt: new Date().toISOString(),
      };
      dispatch(setAuthUser(mockUser));
      dispatch(setDisplayName(mockUser.name));
      toast.success(`Welcome to Pluto, ${mockUser.name}!`);
      setIsLoading(false);
      router.push("/");
    }, 700);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim() || name.trim().length < 2) {
        setErrorMessage("Please enter your display name (at least 2 characters).");
        return;
      }
      if (!isPasswordValid) {
        setErrorMessage("Password does not meet the security requirements.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload =
        mode === "login"
          ? { email, password, rememberMe }
          : { email, password, name };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Authentication failed. Please verify your details.");
        setIsLoading(false);
        return;
      }

      // Update Redux state
      dispatch(setAuthUser(data.user));
      if (data.user?.name) {
        dispatch(setDisplayName(data.user.name));
      }

      toast.success(
        mode === "login"
          ? `Welcome back, ${data.user.name}!`
          : `Welcome to Pluto, ${data.user.name}!`
      );

      // Navigate to Home Dashboard as requested
      router.push(returnUrl || "/");
      router.refresh();
    } catch {
      setErrorMessage("Network connection error. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col lg:flex-row transition-colors duration-500 overflow-x-hidden ${isLight ? "bg-[#F5EFEB] text-neutral-900" : "bg-[#07080C] text-neutral-100"
        }`}
    >
      {/* =========================================================================
          LEFT / HERO ARTWORK PANEL: THE CULTURE WALL (Desktop ~52%, Mobile Compact)
         ========================================================================= */}
      <div className="relative w-full lg:w-[52%] lg:h-screen lg:sticky lg:top-0 shrink-0 overflow-hidden flex flex-col justify-between">
        <CultureWall
          className="w-full h-full"
          themeMode={isLight ? "light" : "dark"}
        />
      </div>

      {/* =========================================================================
          RIGHT / AUTHENTICATION FORM PANEL (Desktop ~48%, Mobile Full-Width)
         ========================================================================= */}
      <div className="w-full lg:w-[48%] flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 z-10 min-h-screen">
        {/* Top Header Row: Tab Switcher & Theme Mode Toggle (Right Aligned) */}
        <div className="w-full max-w-md mx-auto flex items-center justify-end gap-2.5 pt-1 sm:pt-2">
          {/* Tab Pill Toggle: Log in | Sign up */}
          <div
            role="tablist"
            className={`inline-flex items-center p-1 rounded-full text-xs font-medium transition-colors ${
              isLight
                ? "bg-[#EAE2D7] border border-[#DDD3C4]"
                : "bg-white/[0.06] border border-white/10"
            }`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => switchMode("login")}
              className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                mode === "login"
                  ? isLight
                    ? "text-neutral-950 font-semibold"
                    : "text-white font-semibold"
                  : isLight
                  ? "text-neutral-600 hover:text-neutral-950"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {mode === "login" && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className={`absolute inset-0 rounded-full shadow-sm ${
                    isLight
                      ? "bg-white border border-[#DDD3C4]"
                      : "bg-white/15 border border-white/10"
                  }`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Log in</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => switchMode("signup")}
              className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                mode === "signup"
                  ? isLight
                    ? "text-neutral-950 font-semibold"
                    : "text-white font-semibold"
                  : isLight
                  ? "text-neutral-600 hover:text-neutral-950"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {mode === "signup" && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className={`absolute inset-0 rounded-full shadow-sm ${
                    isLight
                      ? "bg-white border border-[#DDD3C4]"
                      : "bg-white/15 border border-white/10"
                  }`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">Sign up</span>
            </button>
          </div>

          {/* Theme Mode Switcher Toggle */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
            className={`p-2 rounded-full border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
              isLight
                ? "bg-white/80 border-[#DDD3C4] text-neutral-700 hover:bg-white"
                : "bg-white/[0.05] border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        {/* Center Authentication Card */}
        <div className="w-full max-w-md mx-auto my-auto py-2 sm:py-3">
          <div
            className={`rounded-3xl p-5 sm:p-7 transition-all duration-300 ${isLight
              ? "bg-[#FFFDF9] border border-[#EADBCE] shadow-[0_25px_70px_-15px_rgba(110,31,50,0.08)]"
              : "bg-[#0c0e14]/90 border border-white/[0.08] backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)]"
              }`}
          >
            {/* Form Title & Subtitle */}
            <div className="mb-4 space-y-1">
              <h2
                className={`font-serif text-2xl sm:text-3xl font-normal tracking-tight ${isLight ? "text-neutral-900" : "text-white"
                  }`}
              >
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p
                className={`text-xs sm:text-sm leading-relaxed ${isLight ? "text-neutral-600" : "text-neutral-400"
                  }`}
              >
                {mode === "login"
                  ? "Good to see you again. Sign in to continue your journey."
                  : "Join Pluto and personalize your discovery experience."}
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                role="alert"
                className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Quick Demo Fill Pill (convenient for reviewers) */}
            <div className="flex items-center justify-between pb-3">
              <span
                className={`text-[11px] font-mono ${isLight ? "text-neutral-500" : "text-neutral-500"
                  }`}
              >

              </span>
              <button
                type="button"
                onClick={fillDemo}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${isLight
                  ? "bg-[#6E1F32]/10 text-[#6E1F32] hover:bg-[#6E1F32]/15 border border-[#6E1F32]/20"
                  : "bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 border border-amber-400/25"
                  }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Fill Demo (Alex Rao)</span>
              </button>
            </div>

            {/* Interactive Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <AnimatePresence mode="wait">
                {/* Sign up: Display Name Field */}
                {mode === "signup" && (
                  <motion.div
                    key="field-name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label
                      htmlFor="display-name"
                      className={`block text-xs font-semibold select-none ${isLight ? "text-neutral-800" : "text-neutral-200"
                        }`}
                    >
                      Display name
                    </label>
                    <div className="relative">
                      <input
                        id="display-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="How should we call you?"
                        disabled={isLoading}
                        autoComplete="name"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm transition focus-visible:outline-none focus-visible:ring-2 ${isLight
                          ? "bg-[#F5EFEB] border-[#DDD3C4] text-neutral-900 placeholder:text-neutral-500 focus-visible:ring-[#6E1F32]/50 focus-visible:border-[#6E1F32]"
                          : "bg-black/50 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-amber-400/50 focus-visible:border-amber-400"
                          }`}
                      />
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-email"
                  className={`block text-xs font-semibold select-none ${isLight ? "text-neutral-800" : "text-neutral-200"
                    }`}
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@pluto.culture"
                    disabled={isLoading}
                    autoComplete="email"
                    required
                    className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm transition focus-visible:outline-none focus-visible:ring-2 ${isLight
                      ? "bg-[#F5EFEB] border-[#DDD3C4] text-neutral-900 placeholder:text-neutral-500 focus-visible:ring-[#6E1F32]/50 focus-visible:border-[#6E1F32]"
                      : "bg-black/50 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-amber-400/50 focus-visible:border-amber-400"
                      }`}
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-password"
                  className={`block text-xs font-semibold select-none ${isLight ? "text-neutral-800" : "text-neutral-200"
                    }`}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === "login" ? "Enter your password" : "Create a strong password"
                    }
                    disabled={isLoading}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    required
                    className={`w-full h-11 pl-10 pr-11 rounded-xl border text-sm transition focus-visible:outline-none focus-visible:ring-2 ${isLight
                      ? "bg-[#F5EFEB] border-[#DDD3C4] text-neutral-900 placeholder:text-neutral-500 focus-visible:ring-[#6E1F32]/50 focus-visible:border-[#6E1F32]"
                      : "bg-black/50 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-amber-400/50 focus-visible:border-amber-400"
                      }`}
                  />
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-200 transition cursor-pointer p-0.5"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Options: Remember Me & Forgot Password */}
              {mode === "login" ? (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={`h-4 w-4 rounded cursor-pointer ${isLight ? "accent-[#6E1F32]" : "accent-amber-400"
                        }`}
                    />
                    <span
                      className={`text-xs ${isLight ? "text-neutral-600" : "text-neutral-400"
                        }`}
                    >
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className={`text-xs hover:underline transition cursor-pointer ${isLight ? "text-[#6E1F32]" : "text-neutral-400 hover:text-white"
                      }`}
                  >
                    Forgot password?
                  </button>
                </div>
              ) : (
                /* Signup Security Requirements Checklist (Concept Board Style) */
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5 pt-1 text-xs"
                >
                  <div className="flex items-center gap-2">
                    {passwordRules.minLength ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mx-1 shrink-0" />
                    )}
                    <span
                      className={`${passwordRules.minLength
                        ? "text-emerald-500 font-medium"
                        : isLight
                          ? "text-neutral-500"
                          : "text-neutral-400"
                        }`}
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRules.hasUpper ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mx-1 shrink-0" />
                    )}
                    <span
                      className={`${passwordRules.hasUpper
                        ? "text-emerald-500 font-medium"
                        : isLight
                          ? "text-neutral-500"
                          : "text-neutral-400"
                        }`}
                    >
                      1 uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRules.hasNumberOrSymbol ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 mx-1 shrink-0" />
                    )}
                    <span
                      className={`${passwordRules.hasNumberOrSymbol
                        ? "text-emerald-500 font-medium"
                        : isLight
                          ? "text-neutral-500"
                          : "text-neutral-400"
                        }`}
                    >
                      1 number or special character
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Submit CTA Button with Tactile Magnetic Feedback */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full h-12 rounded-2xl font-semibold text-sm tracking-wide transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none ${isLight
                    ? "bg-[#6E1F32] hover:bg-[#5A1727] text-white shadow-lg shadow-[#6E1F32]/25"
                    : "bg-gradient-to-r from-[#C26338] via-[#E8A563] to-[#F6E5BA] text-neutral-950 font-bold shadow-lg shadow-[#C26338]/25 hover:brightness-105"
                    }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{mode === "login" ? "Verifying..." : "Creating account..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === "login" ? "Log in" : "Create account"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>

              {/* Social Login Divider */}
              <div className="relative py-2 text-center">
                <div
                  className={`absolute inset-0 flex items-center ${isLight ? "text-neutral-300" : "text-white/10"
                    }`}
                >
                  <div className="w-full border-t border-current" />
                </div>
                <span
                  className={`relative px-4 text-xs select-none ${isLight ? "bg-[#FFFDF9] text-neutral-500" : "bg-[#0c0e14] text-neutral-400"
                    }`}
                >
                  or continue with
                </span>
              </div>

              {/* Social Login Buttons: Google, Apple, X */}
              <div className="grid grid-cols-3 gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth("Google")}
                  aria-label="Continue with Google"
                  className={`h-11 rounded-xl flex items-center justify-center border transition cursor-pointer ${isLight
                    ? "bg-[#F5EFEB] border-[#DDD3C4] text-neutral-800 hover:bg-[#EAE2D7]"
                    : "bg-white/[0.04] border-white/10 text-neutral-200 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth("Apple")}
                  aria-label="Continue with Apple"
                  className={`h-11 rounded-xl flex items-center justify-center border transition cursor-pointer ${isLight
                    ? "bg-[#F5EFEB] border-[#DDD3C4] text-neutral-800 hover:bg-[#EAE2D7]"
                    : "bg-white/[0.04] border-white/10 text-neutral-200 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.71-11.73-14.01-6.19-9.46-11.05-20.08-14.59-31.86-3.53-11.77-5.3-23.11-5.3-34.01 0-14.58 3.73-26.69 11.2-36.33 7.46-9.64 16.89-14.55 28.28-14.74 5.33 0 11.19 1.41 17.58 4.24 6.39 2.83 10.33 4.24 11.83 4.24 1.3 0 5.44-1.52 12.4-4.56 6.96-3.04 12.83-4.46 17.61-4.24 13.48.65 24.35 5.76 32.61 15.33-11.74 7.18-17.4 16.96-16.97 29.35.43 9.79 4.35 17.83 11.74 24.13 7.39 6.31 16.09 9.9 26.09 10.76-2.17 6.74-4.78 13.26-7.83 19.57zM119.22 31.09c0-7.39 2.72-14.35 8.15-20.87 5.43-6.52 12.17-10.22 20.22-11.09.22 1.09.33 2.17.33 3.26 0 7.39-2.83 14.35-8.48 20.87-5.65 6.52-12.5 10.33-20.55 11.41-.22-1.08-.33-2.17-.33-3.26z" />
                  </svg>
                </button>

                {/* X (formerly Twitter) Button */}
                <button
                  type="button"
                  onClick={() => handleSocialAuth("X")}
                  aria-label="Continue with X"
                  className={`h-11 rounded-xl flex items-center justify-center border transition cursor-pointer ${isLight
                    ? "bg-[#F5EFEB] border-[#DDD3C4] text-neutral-800 hover:bg-[#EAE2D7]"
                    : "bg-white/[0.04] border-white/10 text-neutral-200 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Continue as Guest Link */}
        <div className="w-full max-w-md mx-auto pb-2 text-center">
          <Link
            href={returnUrl === "/" ? "/?guest=true" : `${returnUrl}${returnUrl.includes("?") ? "&" : "?"}guest=true`}
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("pluto_guest", "true");
              }
            }}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md py-1.5 px-3 ${
              isLight
                ? "text-neutral-500 hover:text-neutral-900 hover:bg-black/5"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
            }`}
          >
            <span>Continue as guest</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
