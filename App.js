import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Passwords from './src';
import {AuthContextProvider} from './src/context/auth';
import {SettingsContextProvider} from './src/context/settings';
import {ThemeContextProvider} from './src/context/theme';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <AuthContextProvider>
      <SettingsContextProvider>
        <ThemeContextProvider>
          <SafeAreaView style={{flex: 1}}>
            <StatusBar hidden={true} />
            <Passwords />
          </SafeAreaView>
        </ThemeContextProvider>
      </SettingsContextProvider>
    </AuthContextProvider>
  );
};

export default App;
