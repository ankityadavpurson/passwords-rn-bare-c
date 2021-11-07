import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Details from './screens/Details';
import Home from './screens/Home';
import Settings from './screens/Settings';
import Start from './screens/Start';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Profile from './screens/Profile';
import PasswordForm from './screens/PasswordForm';
import EncryptionKey from './screens/EncryptionKey';
import {AuthContext} from './context/auth';

const Stack = createNativeStackNavigator();

const AuthorisedScreens = (
  <>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Details" component={Details} />
    <Stack.Screen name="PasswordForm" component={PasswordForm} />
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Profile" component={Profile} />
  </>
);

const UnAuthorisedScreens = (
  <>
    <Stack.Screen name="Start" component={Start} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
  </>
);

const EncryptionKeyScreen = (
  <Stack.Screen name="EncryptionKey" component={EncryptionKey} />
);

const Password = () => {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={authCtx.user ? 'Home' : 'Start'}
        screenOptions={{animation: 'slide_from_right', headerShown: false}}>
        {authCtx.user
          ? authCtx.key
            ? AuthorisedScreens
            : EncryptionKeyScreen
          : UnAuthorisedScreens}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Password;
