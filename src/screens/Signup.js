import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import CustomButton from '../components/CustomButton';
import GoBack from '../components/GoBack';
import InputField from '../components/InputField';
import ScreenTitle from '../components/ScreenTitle';
import SecureInputField from '../components/SecureInputField';
import {AuthContext} from '../context/auth';
import {normalize} from '../utils/responsive';

const Signup = props => {
  const styles = useStyles();
  const authCtx = useContext(AuthContext);

  const usernameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);

  const [username, setUsername] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  });

  function handleSignup() {
    setUsername(u => ({...u, error: ''}));
    if (username.value.trim() === '') {
      usernameInputRef.current?.focus();
      setUsername(u => ({...u, error: 'Username is required'}));
      return;
    }

    setEmail(u => ({...u, error: ''}));
    if (email.value.trim() === '') {
      emailInputRef.current?.focus();
      setEmail(p => ({...p, error: 'Email is required'}));
      return;
    }

    setPassword(u => ({...u, error: ''}));
    if (password.value.trim() === '') {
      passwordInputRef.current?.focus();
      setPassword(p => ({...p, error: 'Password is required'}));
      return;
    }

    setConfirmPassword(u => ({...u, error: ''}));
    if (confirmPassword.value.trim() === '') {
      confirmPasswordInputRef.current?.focus();
      setConfirmPassword(p => ({
        ...p,
        error: 'Confirm Password is required',
      }));
      return;
    }
    if (confirmPassword.value !== password.value) {
      confirmPasswordInputRef.current?.focus();
      setConfirmPassword(p => ({
        ...p,
        error: 'Confirm Password is not same',
      }));
      return;
    }

    emailInputRef.current?.blur();
    usernameInputRef.current?.blur();
    passwordInputRef.current?.blur();
    confirmPasswordInputRef.current?.blur();

    authCtx.signup(username.value, email.value, password.value);
  }

  return (
    <View style={styles.container}>
      <GoBack />

      <ScreenTitle title="Signup" />

      <InputField
        mode="outlined"
        label="Username"
        returnKeyType="next"
        refs={usernameInputRef}
        value={username.value}
        error={username.error}
        onSubmitEditing={() => emailInputRef.current?.focus()}
        onChangeText={value => setUsername({value, error: ''})}
      />

      <InputField
        mode="outlined"
        label="Email"
        keyboardType="email-address"
        returnKeyType="next"
        refs={emailInputRef}
        value={email.value}
        error={email.error}
        onSubmitEditing={() => passwordInputRef.current?.focus()}
        onChangeText={value => setEmail({value, error: ''})}
      />

      <SecureInputField
        mode="outlined"
        label="Password"
        returnKeyType="next"
        refs={passwordInputRef}
        value={password.value}
        error={password.error}
        onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
        onChangeText={value => setPassword({value, error: ''})}
      />

      <SecureInputField
        mode="outlined"
        label="Confirm Password"
        returnKeyType="done"
        refs={confirmPasswordInputRef}
        value={confirmPassword.value}
        error={confirmPassword.error}
        onSubmitEditing={handleSignup}
        onChangeText={value => setConfirmPassword({value, error: ''})}
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          text="Singup"
          mode="contained"
          loading={authCtx.loading}
          disabled={authCtx.loading}
          onPress={handleSignup}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          text="Login"
          mode="outlined"
          disabled={authCtx.loading}
          onPress={() => props.navigation.navigate('Login')}
        />
      </View>
    </View>
  );
};

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: normalize(15),
      backgroundColor: theme.colors.background,
    },
    buttonContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
  });
};

export default Signup;
