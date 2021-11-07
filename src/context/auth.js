import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import React, {createContext, useEffect, useState} from 'react';
import asyncStore from '../utils/asyncStore';
import {showToastLong} from '../utils/toast';

export const AuthContext = createContext({
  loading: true,
  user: null,
  key: null,
  signup: (_username, _email, _password) => {},
  login: (_username, _password) => {},
  setUserCredential: _userCredential => {},
  setEncryptionKey: _value => {},
  logout: () => {},
});

export const AuthContextProvider = props => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [key, setKey] = useState(null);

  useEffect(() => {
    getAsyncStore();

    async function getAsyncStore() {
      setLoading(true);
      const initialUser = await asyncStore.getStoredUser();
      const initialKey = await asyncStore.getStoredKey();
      setKey(JSON.parse(initialKey)?.value);
      setUser(JSON.parse(initialUser));
      setLoading(false);
    }
  }, []);

  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      await userCredential.user?.updateProfile({displayName: username});
      await userCredential.user?.sendEmailVerification();
      await setUserCredential(userCredential);
      setLoading(false);
    } catch (error) {
      crashlytics().recordError(error, 'Signup Error.');
      setLoading(false);
      showToastLong('Signup Error.');
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      const userCredential = await auth().signInWithEmailAndPassword(
        username,
        password,
      );
      await setUserCredential(userCredential);
      setLoading(false);
    } catch (error) {
      crashlytics().recordError(error, 'Login Error.');
      setLoading(false);
      showToastLong('Login Error.');
    }
  };

  const setUserCredential = async userCredential => {
    setLoading(true);
    const authtoken = await userCredential.user?.getIdToken();
    if (authtoken) {
      // getting, setting and saving user
      const user = userCredential.user?.toJSON();
      await asyncStore.setStoredUser(JSON.stringify(user));
      setLoading(false);
      setUser(user);
    } else {
      setLoading(false);
      throw new Error('Unable to get auth token');
    }
  };

  const setEncryptionKey = async keyData => {
    try {
      await asyncStore.setStoredKey(JSON.stringify(keyData));
      setKey(keyData.value);
    } catch (error) {
      crashlytics().recordError(error, 'Saving key Error.');
      showToastLong('Saving key Error.');
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      if (auth().currentUser) await auth().signOut();
      await asyncStore.removeStoredValue(asyncStore.storeKyes.USER);
      await asyncStore.removeStoredValue(asyncStore.storeKyes.KEY);
      setLoading(false);
      // unsetting and removing auth user
      setUser(null);
      setKey(null);
    } catch (error) {
      crashlytics().recordError(error, 'Logout Error.');
      setLoading(false);
      showToastLong('Logout Error.');
    }
  };

  const contextValue = {
    loading,
    user,
    key,
    signup,
    login,
    setUserCredential,
    setEncryptionKey,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
