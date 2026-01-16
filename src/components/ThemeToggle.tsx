'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Récupérer la préférence sauvegardée ou utiliser dark par défaut
    const saved = localStorage.getItem('theme');
    const initialDark = saved ? saved === 'dark' : true;
    setIsDark(initialDark);
    applyTheme(initialDark);
  }, []);

  const applyTheme = (dark: boolean) => {
    const root = document.querySelector('.gold-variant');
    if (root) {
      if (dark) {
        root.classList.remove('light');
      } else {
        root.classList.add('light');
      }
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    applyTheme(newIsDark);
  };

  // Éviter le flash lors du rendu initial
  if (!mounted) {
    return (
      <button
        className="gold-theme-toggle"
        aria-label="Chargement du thème"
        disabled
      >
        <Sun size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="gold-theme-toggle"
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
