"use client";

import React from "react";

export function AtmosphericBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Light Theme Atmospheric Ribbons */}
      <div className="dark:hidden absolute inset-0">
        {/* Soft cosmic glow spots */}
        <div
          className="absolute -top-[10%] left-[20%] h-[550px] w-[550px] rounded-full opacity-60 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(167, 139, 250, 0.35) 0%, rgba(192, 132, 252, 0.15) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[25%] -right-[5%] h-[600px] w-[600px] rounded-full opacity-50 blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(129, 140, 248, 0.15) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-[10%] left-[30%] h-[500px] w-[500px] rounded-full opacity-40 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(244, 114, 182, 0.2) 0%, rgba(167, 139, 250, 0.1) 60%, transparent 75%)",
          }}
        />

        {/* Ethereal ribbon waves matching the reference image */}
        <svg
          className="absolute inset-0 h-full w-full opacity-70"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lightRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="lightRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.2" />
            </linearGradient>
            <filter id="lightBlur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="35" />
            </filter>
          </defs>

          {/* Sweeping ambient wave paths */}
          <path
            d="M -100 650 C 300 750, 500 350, 900 480 C 1200 580, 1400 300, 1600 200"
            stroke="url(#lightRibbon1)"
            strokeWidth="80"
            strokeLinecap="round"
            filter="url(#lightBlur)"
          />
          <path
            d="M 100 800 C 450 600, 750 700, 1100 350 C 1300 150, 1500 250, 1650 100"
            stroke="url(#lightRibbon2)"
            strokeWidth="60"
            strokeLinecap="round"
            filter="url(#lightBlur)"
          />
          <path
            d="M -50 400 C 350 250, 700 450, 1150 220 C 1350 120, 1450 180, 1600 50"
            stroke="url(#lightRibbon1)"
            strokeWidth="35"
            strokeOpacity="0.3"
            filter="url(#lightBlur)"
          />
        </svg>
      </div>

      {/* Dark Theme Glowing Neon Atmospheric Ribbons */}
      <div className="hidden dark:block absolute inset-0">
        {/* Deep cosmic glow spots */}
        <div
          className="absolute -top-[15%] left-[25%] h-[650px] w-[650px] rounded-full opacity-45 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.25) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[20%] -right-[10%] h-[700px] w-[700px] rounded-full opacity-40 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(37, 99, 235, 0.5) 0%, rgba(168, 85, 247, 0.25) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-[15%] left-[10%] h-[600px] w-[600px] rounded-full opacity-35 blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, rgba(99, 102, 241, 0.2) 60%, transparent 75%)",
          }}
        />

        {/* Luminous plasma ribbons matching the reference dark mode */}
        <svg
          className="absolute inset-0 h-full w-full opacity-85"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="darkNeon1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#6366f1" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="darkNeon2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
            </linearGradient>
            <filter id="darkGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="45" />
            </filter>
            <filter id="darkCoreGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>

          {/* Diffuse background aura */}
          <path
            d="M -100 680 C 320 800, 550 360, 950 490 C 1220 590, 1420 320, 1620 220"
            stroke="url(#darkNeon1)"
            strokeWidth="90"
            strokeLinecap="round"
            filter="url(#darkGlow)"
          />
          <path
            d="M 80 820 C 440 620, 780 720, 1140 370 C 1320 170, 1520 270, 1680 120"
            stroke="url(#darkNeon2)"
            strokeWidth="70"
            strokeLinecap="round"
            filter="url(#darkGlow)"
          />

          {/* Sharper luminous ribbon highlights */}
          <path
            d="M -80 670 C 330 780, 560 380, 940 480 C 1200 560, 1400 310, 1600 210"
            stroke="url(#darkNeon1)"
            strokeWidth="24"
            strokeLinecap="round"
            filter="url(#darkCoreGlow)"
            opacity="0.9"
          />
          <path
            d="M 100 800 C 460 610, 770 700, 1120 360 C 1300 180, 1500 260, 1650 130"
            stroke="url(#darkNeon2)"
            strokeWidth="18"
            strokeLinecap="round"
            filter="url(#darkCoreGlow)"
            opacity="0.8"
          />
        </svg>
      </div>
    </div>
  );
}
