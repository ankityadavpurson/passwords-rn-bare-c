import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';

import CustomButton from '../components/CustomButton';
import ForgotPassword from '../components/ForgotPassword';
import GoBack from '../components/GoBack';
import InputField from '../components/InputField';
import ScreenTitle from '../components/ScreenTitle';
import SecureInputField from '../components/SecureInputField';
import {AuthContext} from '../context/auth';
import {normalize} from '../utils/responsive';

const Login = props => {
  const authCtx = useContext(AuthContext);
  const styles = useStyles();

  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const [username, setUsername] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});

  function handleLogin() {
    setUsername(u => ({...u, error: ''}));
    if (username.value.trim() === '') {
      usernameInputRef.current?.focus();
      setUsername(u => ({...u, error: 'Email is required'}));
      return;
    }

    setPassword(u => ({...u, error: ''}));
    if (password.value.trim() === '') {
      passwordInputRef.current?.focus();
      setPassword(p => ({...p, error: 'Password is required'}));
      return;
    }

    usernameInputRef.current?.blur();
    passwordInputRef.current?.blur();

    authCtx.login(username.value, password.value);
  }

  return (
    <View style={styles.container}>
      <GoBack />

      <ScreenTitle title="Login" />

      <InputField
        mode="outlined"
        label="Email"
        keyboardType="email-address"
        returnKeyType="next"
        refs={usernameInputRef}
        value={username.value}
        error={username.error}
        onSubmitEditing={() => passwordInputRef.current?.focus()}
        onChangeText={value => setUsername({value, error: ''})}
      />

      <SecureInputField
        mode="outlined"
        label="Password"
        returnKeyType="done"
        refs={passwordInputRef}
        value={password.value}
        error={password.error}
        onSubmitEditing={handleLogin}
        onChangeText={value => setPassword({value, error: ''})}
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          text="Login"
          mode="contained"
          loading={authCtx.loading}
          disabled={authCtx.loading}
          onPress={handleLogin}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          text="Signup"
          mode="outlined"
          disabled={authCtx.loading}
          onPress={() => props.navigation.navigate('Signup')}
        />
      </View>

      <ForgotPassword loading={authCtx.loading} />
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

export default Login;
