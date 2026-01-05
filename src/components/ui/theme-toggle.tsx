"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Render a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-10 h-10 border border-[var(--ra-border)] bg-[var(--ra-bg-elevated)]" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 flex items-center justify-center border border-[var(--ra-border)] hover:border-[var(--ra-orange)] bg-[var(--ra-bg-elevated)] transition-all duration-300 group"
      aria-label={theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      <Sun
        className={`w-5 h-5 absolute transition-all duration-300 ${
          theme === "dark"
            ? "opacity-0 rotate-90 scale-0"
            : "opacity-100 rotate-0 scale-100 text-[var(--ra-orange)]"
        }`}
      />
      <Moon
        className={`w-5 h-5 absolute transition-all duration-300 ${
          theme === "dark"
            ? "opacity-100 rotate-0 scale-100 text-[var(--ra-text-subtle)] group-hover:text-[var(--ra-orange)]"
            : "opacity-0 -rotate-90 scale-0"
        }`}
      />
    </button>
  );
}
