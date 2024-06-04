import { Theme, useAppStore } from '@/stores/app.store';
import { useEffect } from 'react';

export const ThemeProvider = () => {
  const theme = useAppStore(state => state.theme);
  useEffect(() => {
    let currentTheme = '';
    console.log('themetheme:::', theme)
    if (!theme || ['dark', 'light'].indexOf(theme) < 0) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDarkMode) {
        currentTheme = 'dark';
      } else {
        currentTheme = 'light';
      }
    } else {
      currentTheme = theme;
    }
    console.log(currentTheme);
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return <></>;
};
