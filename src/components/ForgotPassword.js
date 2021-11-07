import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Dialog, Paragraph, Portal, useTheme} from 'react-native-paper';

import CustomButton from './CustomButton';
import InputField from './InputField';
import {showToastLong, showToastShort} from '../utils/toast';
import DialogButton from './DialogButton';

const ForgotPassword = props => {
  const styles = useStyles();
  const usernameInputRef = useRef(null);

  const [username, setUsername] = useState({value: '', error: ''});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const hideDialog = () => {
    setUsername({value: '', error: ''});
    setLoading(false);
    setVisible(false);
  };

  async function handleForgotPassword() {
    setUsername(u => ({...u, error: ''}));
    if (username.value.trim() === '') {
      usernameInputRef.current?.focus();
      setUsername(u => ({...u, error: 'Email is required'}));
      return;
    }
    try {
      setLoading(true);
      await auth().sendPasswordResetEmail(username.value);
      showToastLong('Reset email is send.');
      setLoading(false);
      hideDialog(false);
    } catch (error) {
      crashlytics().recordError(error, 'Sending email error.');
      setLoading(false);
      showToastShort('Sending email error.');
    }
  }

  return (
    <>
      <View style={styles.buttonContainer}>
        <CustomButton
          mode="text"
          text="Forgot Password"
          disabled={props.loading}
          onPress={() => setVisible(true)}
        />
      </View>

      <Portal>
        <Dialog
          dismissable={!loading}
          visible={visible}
          onDismiss={() => hideDialog(false)}>
          <Dialog.Title>Forgot Password</Dialog.Title>
          <Dialog.Content>
            <InputField
              mode="outlined"
              label="Email"
              returnKeyType="done"
              keyboardType="email-address"
              refs={usernameInputRef}
              value={username.value}
              error={username.error}
              onSubmitEditing={handleForgotPassword}
              onChangeText={value => setUsername(u => ({...u, value}))}
            />

            <Paragraph>
              If this email is registered, then a reset link will be sent to
              this email.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <DialogButton
              label="Cancel"
              disabled={loading}
              onPress={() => hideDialog(false)}
            />
            <DialogButton
              label="Send"
              disabled={loading}
              loading={loading}
              onPress={handleForgotPassword}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    buttonContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
  });
};

export default ForgotPassword;
