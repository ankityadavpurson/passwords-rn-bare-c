import React, {createContext, useEffect, useState} from 'react';
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import {useColorScheme} from 'react-native';
import asyncStore from '../utils/asyncStore';

export const ThemeContext = createContext({
  dark: false,
  change: () => {},
});

export const ThemeContextProvider = props => {
  const theme = useColorScheme();
  const [darkTheme, setDarkTheme] = useState(theme === 'dark');

  useEffect(() => {
    getAsyncStore();

    async function getAsyncStore() {
      let initialTheme = await asyncStore.getStoredTheme();
      initialTheme = initialTheme ? initialTheme : theme;
      setDarkTheme(initialTheme === 'dark');
    }
  }, []);

  const changeTheme = async () => {
    setDarkTheme(!darkTheme);
    await asyncStore.setStoredTheme(!darkTheme ? 'dark' : 'light');
  };

  const contextValue = {
    dark: darkTheme,
    change: changeTheme,
  };

  const themeColors = {
    primary: '#A4161A', // Ruby Red
    accent: '#E5383B', // Imperail Red
    error: '#A4161A', // Ruby Red
    notification: '#A4161A', // Ruby Red
  };

  const darkThemeColors = {
    ...themeColors,
    background: '#121212', // Dark grey
    surface: '#121212', // Dark grey
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <PaperProvider
        theme={
          darkTheme
            ? {
                ...DarkTheme,
                roundness: 2,
                colors: {...DarkTheme.colors, ...darkThemeColors},
              }
            : {
                ...DefaultTheme,
                roundness: 2,
                colors: {...DefaultTheme.colors, ...themeColors},
              }
        }>
        {props.children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};
