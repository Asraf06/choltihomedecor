"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("cholti_theme", next ? "dark" : "light");
    } catch {
      // storage unavailable, theme still applies for this visit
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="w-[42px] h-[42px] rounded-full bg-paper border border-line grid place-items-center text-forest dark:text-gold"
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
