"use client";

import { useAppDispatch } from "@/store/hooks";
import { setAuthUser } from "@/store/slices/authSlice";
import { setDisplayName } from "@/store/slices/preferencesSlice";
import { toast } from "@/components/ui/Toast";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  User,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password rules validation
  const rules = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const isPasswordValid = rules.minLength && rules.hasUpper && rules.hasNumber && rules.hasSymbol;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Please meet all password security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter carefully.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please agree to the membership guidelines to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to create membership account.");
        setIsLoading(false);
        return;
      }

      // Sync Redux
      dispatch(setAuthUser(data.user));
      if (data.user?.name) {
        dispatch(setDisplayName(data.user.name));
      }

      toast.success(`Welcome to Pluto, ${data.user.name}!`);
      router.push(returnUrl);
      router.refresh();
    } catch {
      setErrorMessage("Network error. Could not connect to Pluto registration service.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Error alert banner */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span className="leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Name Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-name"
          className="block text-xs font-semibold text-neutral-200 select-none"
        >
          Full Name / Moniker
        </label>
        <div className="relative">
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Elena Rostova"
            disabled={isLoading}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black/50 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50 focus-visible:border-amber-400/60 transition"
          />
          <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-email"
          className="block text-xs font-semibold text-neutral-200 select-none"
        >
          Email address
        </label>
        <div className="relative">
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="elena@studio.culture"
            disabled={isLoading}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black/50 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50 focus-visible:border-amber-400/60 transition"
          />
          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* Password Input with Visibility Toggle */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-password"
          className="block text-xs font-semibold text-neutral-200 select-none"
        >
          Create Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            disabled={isLoading}
            className="w-full h-11 pl-10 pr-11 rounded-xl border border-white/10 bg-black/50 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50 focus-visible:border-amber-400/60 transition"
          />
          <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-3 text-neutral-400 hover:text-white transition cursor-pointer p-0.5"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-confirm-password"
          className="block text-xs font-semibold text-neutral-200 select-none"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="signup-confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Re-enter password"
            disabled={isLoading}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black/50 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50 focus-visible:border-amber-400/60 transition"
          />
          <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* Live Security Guidance Checklist */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5 text-[11px]">
        <p className="font-semibold text-neutral-200 text-[11px]">Password Security Requirements:</p>
        <div className="grid grid-cols-2 gap-1.5 text-neutral-400">
          <div className="flex items-center gap-1.5">
            {rules.minLength ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-neutral-600" />
            )}
            <span className={rules.minLength ? "text-emerald-300 font-medium" : ""}>
              8+ Characters
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {rules.hasUpper ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-neutral-600" />
            )}
            <span className={rules.hasUpper ? "text-emerald-300 font-medium" : ""}>
              Uppercase Letter
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {rules.hasNumber ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-neutral-600" />
            )}
            <span className={rules.hasNumber ? "text-emerald-300 font-medium" : ""}>
              Numeric Digit
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {rules.hasSymbol ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-neutral-600" />
            )}
            <span className={rules.hasSymbol ? "text-emerald-300 font-medium" : ""}>
              Special Symbol
            </span>
          </div>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start gap-2 pt-0.5">
        <input
          id="signup-terms"
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-400/30 cursor-pointer mt-0.5 accent-amber-400"
        />
        <label
          htmlFor="signup-terms"
          className="text-[11px] text-neutral-400 select-none cursor-pointer leading-tight"
        >
          I agree to the Pluto Cultural Curatorship Standards and zero-tracking privacy charter.
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !isPasswordValid}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/15 hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
              <span>Creating Membership...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Switch to Login */}
      <div className="pt-2 text-center">
        <p className="text-xs text-neutral-400">
          Already have a membership?{" "}
          <Link
            href={`/login${returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}${email ? `${returnUrl !== "/" ? "&" : "?"}email=${encodeURIComponent(email)}` : ""}`}
            className="font-semibold text-amber-300 hover:text-amber-200 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
