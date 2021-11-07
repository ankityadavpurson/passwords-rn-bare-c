import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB, useTheme} from 'react-native-paper';

import {showToastShort} from '../utils/toast';
import {cipher, decipher} from '../crypto';
import {AuthContext} from '../context/auth';
import InputField from '../components/InputField';
import SecureInputField from '../components/SecureInputField';
import {normalize} from '../utils/responsive';
import ScreenTitle from '../components/ScreenTitle';

const PasswordForm = props => {
  const PASSWORD = props.route.params;
  const styles = useStyles();
  const authCtx = useContext(AuthContext);

  const nameInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const valueInputRef = useRef(null);
  const linkInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [passwordName, setPasswordName] = useState({
    value: PASSWORD ? PASSWORD.name : '',
    error: '',
  });
  const [passwordUsername, setPasswordUsername] = useState({
    value: PASSWORD ? PASSWORD.username : '',
    error: '',
  });
  const [passwordvalue, setPasswordvalue] = useState({
    value: PASSWORD ? decipher(PASSWORD.value, authCtx.key) : '',
    error: '',
  });
  const [passwordLink, setPasswordLink] = useState({
    value: PASSWORD ? PASSWORD.link : '',
    error: '',
  });

  function getPasswordData() {
    setPasswordName(u => ({...u, error: ''}));
    if (passwordName.value.trim() === '') {
      nameInputRef.current?.focus();
      setPasswordName(u => ({...u, error: 'Name is required'}));
      return;
    }

    setPasswordUsername(u => ({...u, error: ''}));
    if (passwordUsername.value.trim() === '') {
      usernameInputRef.current?.focus();
      setPasswordUsername(u => ({...u, error: 'Username is required'}));
      return;
    }

    setPasswordvalue(u => ({...u, error: ''}));
    if (passwordvalue.value.trim() === '') {
      valueInputRef.current?.focus();
      setPasswordvalue(p => ({...p, error: 'Value is required'}));
      return;
    }

    setPasswordLink(u => ({...u, error: ''}));
    if (passwordLink.value.trim() === '') {
      linkInputRef.current?.focus();
      setPasswordLink(p => ({...p, error: 'Link is required'}));
      return;
    }

    const passwordData = {
      name: passwordName.value,
      username: passwordUsername.value,
      value: passwordvalue.value,
      link: passwordLink.value,
      createdAt: new Date().getTime().toString(),
      updatedAt: new Date().getTime().toString(),
    };

    return passwordData;
  }

  async function handleAddNewPassword() {
    try {
      const passwordData = getPasswordData();
      if (passwordData) {
        inputBlur();
        setLoading(true);
        passwordData.value = cipher(passwordData.value, authCtx.key);
        await firestore().collection(authCtx.user.uid).add(passwordData);
        showToastShort('Password added');
        setLoading(false);
        props.navigation.goBack();
      }
    } catch (error) {
      crashlytics().recordError(error);
      setLoading(false);
      showToastShort('Error adding password');
    }
  }

  async function handleUpdatePassword() {
    try {
      const passwordData = getPasswordData();

      if (noUpdateRequired(passwordData)) {
        props.navigation.goBack();
        return;
      }

      if (passwordData) {
        inputBlur();
        setLoading(true);
        delete passwordData.createdAt;
        passwordData.value = cipher(passwordData.value, authCtx.key);
        await firestore()
          .collection(authCtx.user.uid)
          .doc(PASSWORD.id)
          .update(passwordData);
        setLoading(false);
        showToastShort('Password updated');
        props.navigation.goBack();
      }
    } catch (error) {
      crashlytics().recordError(error, 'Error updating password');
      setLoading(false);
      showToastShort('Error updating password');
    }
  }

  function noUpdateRequired(passwordData) {
    return (
      decipher(`${PASSWORD.value}`, authCtx.key) === passwordData.value &&
      PASSWORD.username === passwordData.username &&
      PASSWORD.name === passwordData.name &&
      PASSWORD.link === passwordData.link
    );
  }

  function inputBlur() {
    nameInputRef.current?.blur();
    usernameInputRef.current?.blur();
    valueInputRef.current?.blur();
    linkInputRef.current?.blur();
  }

  return (
    <View style={styles.container}>
      <ScreenTitle
        title={PASSWORD ? 'Update password' : 'Add password'}
        size={26}
      />

      <InputField
        mode="outlined"
        label="Name"
        returnKeyType="next"
        refs={nameInputRef}
        value={passwordName.value}
        error={passwordName.error}
        onSubmitEditing={() => usernameInputRef.current?.focus()}
        onChangeText={value => setPasswordName({value, error: ''})}
      />

      <InputField
        mode="outlined"
        label="Username"
        returnKeyType="next"
        refs={usernameInputRef}
        value={passwordUsername.value}
        error={passwordUsername.error}
        onSubmitEditing={() => valueInputRef.current?.focus()}
        onChangeText={value => setPasswordUsername({value, error: ''})}
      />

      <SecureInputField
        mode="outlined"
        label="Value"
        returnKeyType="next"
        refs={valueInputRef}
        value={passwordvalue.value}
        error={passwordvalue.error}
        onSubmitEditing={() => linkInputRef.current?.focus()}
        onChangeText={value => setPasswordvalue({value, error: ''})}
      />

      <InputField
        mode="outlined"
        label="Link"
        returnKeyType="done"
        refs={linkInputRef}
        value={passwordLink.value}
        error={passwordLink.error}
        onChangeText={value => setPasswordLink({value, error: ''})}
        onSubmitEditing={PASSWORD ? handleUpdatePassword : handleAddNewPassword}
      />

      <FAB
        icon="close"
        style={styles.fabCancel}
        disabled={loading}
        onPress={() => props.navigation.goBack()}
      />

      <FAB
        icon="check"
        style={styles.fabDone}
        disabled={loading}
        loading={loading}
        onPress={PASSWORD ? handleUpdatePassword : handleAddNewPassword}
      />
    </View>
  );
};

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: normalize(15),
      backgroundColor: theme.colors.background,
    },
    fabCancel: {
      position: 'absolute',
      margin: normalize(16),
      left: 0,
      bottom: 0,
    },
    fabDone: {
      position: 'absolute',
      margin: normalize(16),
      right: 0,
      bottom: 0,
    },
  });
};

export default PasswordForm;
