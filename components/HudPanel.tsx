"use client";
import React from "react";

export function HudPanel({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`hud-panel p-6 md:p-7 relative ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {subtitle && (
            <p className="text-[10px] tracking-[0.3em] text-ls-sky font-bold uppercase mb-2">
              {subtitle}
            </p>
          )}
          {title && <h3 className="text-xl md:text-2xl font-display font-bold">{title}</h3>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}

export function Chip({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "mindset" | "action" | "standard" | "pass" | "fail" | "retry";
}) {
  const variantClass = {
    default: "bg-ls-line/40 border-ls-line text-ls-white",
    mindset: "cat-mindset border-none",
    action: "cat-action border-none",
    standard: "cat-standard border-none",
    pass: "badge-pass",
    fail: "badge-fail",
    retry: "badge-retry",
  }[variant];

  if (["pass", "fail", "retry"].includes(variant)) {
    return <span className={variantClass}>{children}</span>;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${variantClass}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-2 bg-ls-navy border border-ls-line rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-ls-deepblue via-ls-blue to-ls-sky transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
