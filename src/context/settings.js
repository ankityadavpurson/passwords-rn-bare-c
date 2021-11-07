import React, {createContext, useEffect, useState} from 'react';
import asyncStore from '../utils/asyncStore';

export const SettingsContext = createContext({
  localEncryption: true,
  visibleButton: true,
  asterisked: true,
  changeLocalEncryption: _value => {},
  changeVisibleButton: _value => {},
  changeAsterisked: _value => {},
});

export const SettingsContextProvider = props => {
  const [settings, setSettings] = useState({
    localEncryption: true,
    visibleButton: true,
    asterisked: true,
  });

  useEffect(() => {
    getAsyncStore();

    async function getAsyncStore() {
      const initialSettings = await asyncStore.getStoredSettings();
      if (initialSettings) setSettings(s => ({...s, ...initialSettings}));
    }
  }, []);

  async function changeLocalEncryption(value) {
    setSettings(s => ({...s, localEncryption: value}));
    const settingToStore = {...settings, localEncryption: value};
    await asyncStore.setStoredSettings(settingToStore);
  }

  async function changeVisibleButton(value) {
    setSettings(s => ({...s, visibleButton: value}));
    const settingToStore = {...settings, visibleButton: value};
    await asyncStore.setStoredSettings(settingToStore);
  }

  async function changeAsterisked(value) {
    setSettings(s => ({...s, asterisked: value, visibleButton: value}));
    const settingToStore = {
      ...settings,
      asterisked: value,
      visibleButton: value,
    };
    await asyncStore.setStoredSettings(settingToStore);
  }

  const settingsContextValue = {
    localEncryption: settings.localEncryption,
    visibleButton: settings.visibleButton,
    asterisked: settings.asterisked,
    changeLocalEncryption,
    changeVisibleButton,
    changeAsterisked,
  };

  return (
    <SettingsContext.Provider value={settingsContextValue}>
      {props.children}
    </SettingsContext.Provider>
  );
};
