import { useBusinessNavigationData } from '@/hooks/use-business-navigation-data';
import { Theme, useAppStore } from '@/stores/app.store';
import { useEffect } from 'react';

export const ThemeProvider = () => {
  const setTheme = useAppStore(state => state.setTheme);
  const themeSetting = useAppStore(state => state.themeSetting);
  const { isHelpDesk } = useBusinessNavigationData();
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
  

  useEffect(() => {
    // Help desk should always be light theme
    if(isHelpDesk && themeSetting != 'light') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, [themeSetting, setTheme, isHelpDesk]);

  return <></>;
};
