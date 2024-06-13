import { Theme, useAppStore } from '@/stores/app.store';
import { useEffect } from 'react';

export const ThemeProvider = () => {
  const setTheme = useAppStore(state => state.setTheme);
  const themeSetting = useAppStore(state => state.themeSetting);
  useEffect(() => {
    let currentTheme: Theme = 'light';
    if (themeSetting === 'system' || !themeSetting) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        currentTheme = 'dark';
      } else {
        currentTheme = 'light';
      }
    } else {
      currentTheme = themeSetting;
    }
    setTheme(currentTheme as Theme);
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [setTheme, themeSetting]);
  
  return <></>;
};
