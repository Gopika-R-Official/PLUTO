"use client";

import { useAppDispatch } from "@/store/hooks";
import { setAuthUser } from "@/store/slices/authSlice";
import { setDisplayName } from "@/store/slices/preferencesSlice";
import { toast } from "@/components/ui/Toast";
import { AlertCircle, Check, Eye, EyeOff, KeyRound, Loader2, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fillDemoCredentials = () => {
    setEmail("alex@pluto.culture");
    setPassword("PlutoCulture2026!");
    setErrorMessage(null);
    toast.info("Demo credentials filled for Alex Rao");
  };

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

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Authentication failed. Please check your credentials.");
        setIsLoading(false);
        return;
      }

      // Sync Redux
      dispatch(setAuthUser(data.user));
      if (data.user?.name) {
        dispatch(setDisplayName(data.user.name));
      }

      toast.success(`Welcome back, ${data.user.name}!`);
      router.push(returnUrl);
      router.refresh();
    } catch {
      setErrorMessage("Network error. Could not connect to Pluto authentication service.");
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

      {/* Demo Credentials Quick-Fill Pill */}
      <div className="flex items-center justify-between pb-1">
        <span className="text-[11px] text-neutral-400 font-mono">Testing Pluto?</span>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/25 hover:bg-amber-400/20 transition cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Fill Demo (Alex Rao)</span>
        </button>
      </div>

      {/* Email Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="block text-xs font-semibold text-neutral-200 select-none"
        >
          Email address
        </label>
        <div className="relative">
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="name@pluto.culture"
            disabled={isLoading}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-black/50 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/50 focus-visible:border-amber-400/60 transition"
          />
          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500 pointer-events-none" />
        </div>
      </div>

      {/* Password Input with Visibility Toggle */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="block text-xs font-semibold text-neutral-200 select-none"
          >
            Password
          </label>
          <span className="text-[11px] text-neutral-400 hover:text-white transition cursor-pointer">
            Forgot password?
          </span>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
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

      {/* Remember Me Option */}
      <div className="flex items-center gap-2 pt-0.5">
        <input
          id="login-remember"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-400/30 cursor-pointer accent-amber-400"
        />
        <label
          htmlFor="login-remember"
          className="text-xs text-neutral-400 select-none cursor-pointer"
        >
          Keep my session active on this device
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/15 hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-neutral-950" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to Pluto</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Switch to Signup */}
      <div className="pt-2 text-center">
        <p className="text-xs text-neutral-400">
          Don&apos;t have an account yet?{" "}
          <Link
            href={`/signup${returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}${email ? `${returnUrl !== "/" ? "&" : "?"}email=${encodeURIComponent(email)}` : ""}`}
            className="font-semibold text-amber-300 hover:text-amber-200 hover:underline"
          >
            Create membership
          </Link>
        </p>
      </div>
    </form>
  );
}
