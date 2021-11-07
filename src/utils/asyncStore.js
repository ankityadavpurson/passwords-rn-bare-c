import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStore {
  storeKyes = {
    KEY: '@key',
    USER: '@user',
    THEME: '@theme',
    SETTINGS: '@settings',
  };

  getStoredUser = async () => {
    try {
      const user = await AsyncStorage.getItem(this.storeKyes.USER);
      return user;
    } catch (e) {
      // log the errors
      return null;
    }
  };

  setStoredUser = async value => {
    try {
      await AsyncStorage.setItem(this.storeKyes.USER, value);
    } catch (e) {
      // log the errors
    }
  };

  getStoredKey = async () => {
    try {
      const user = await AsyncStorage.getItem(this.storeKyes.KEY);
      return user;
    } catch (e) {
      // log the errors
      return null;
    }
  };

  setStoredKey = async value => {
    try {
      await AsyncStorage.setItem(this.storeKyes.KEY, value);
    } catch (e) {
      // log the errors
    }
  };

  getStoredTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem(this.storeKyes.THEME);
      return theme;
    } catch (e) {
      // log the errors
      return null;
    }
  };

  setStoredTheme = async value => {
    try {
      await AsyncStorage.setItem(this.storeKyes.THEME, value);
    } catch (e) {
      // log the errors
    }
  };

  getStoredSettings = async () => {
    try {
      const settingsFromStore = await AsyncStorage.getItem(
        this.storeKyes.SETTINGS,
      );

      const settings = settingsFromStore ? JSON.parse(settingsFromStore) : null;

      return settings;
    } catch (e) {
      // log the errors
      return null;
    }
  };

  setStoredSettings = async settings => {
    try {
      const settingsToStore = JSON.stringify(settings);
      await AsyncStorage.setItem(this.storeKyes.SETTINGS, settingsToStore);
    } catch (e) {
      // log the errors
    }
  };

  // for removing any key
  removeStoredValue = async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      // log the errors
    }
  };
}

const asyncStore = new AsyncStore();

export default asyncStore;
