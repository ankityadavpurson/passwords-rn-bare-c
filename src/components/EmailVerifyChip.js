import crashlytics from '@react-native-firebase/crashlytics';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Chip, Dialog, Paragraph, Portal} from 'react-native-paper';
import {showToastLong} from '../utils/toast';
import DialogButton from './DialogButton';

const EmailVerifyChip = props => {
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [loading, setLoading] = useState(false);

  const handleEmailVerify = async () => {
    try {
      setLoading(true);
      // await auth.currentUser?.sendEmailVerification();
      hideDialog();
      showToastLong('Link sent successfully, Check your mails.');
      setLoading(false);
    } catch (error) {
      crashlytics().recordError(error, 'Unable to send link, try again.');
      setLoading(false);
      showToastLong('Unable to send link, try again.');
    }
  };

  return (
    <>
      {props.verified ? (
        <Chip
          mode="outlined"
          textStyle={styles.verifiedText}
          style={styles.verifiedStyle}>
          Verified
        </Chip>
      ) : (
        <Chip
          onPress={() => showDialog()}
          mode="outlined"
          textStyle={styles.verifyText}
          style={styles.verifyStyle}>
          Verify
        </Chip>
      )}

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Email Verify</Dialog.Title>
          <Dialog.Content>
            <Paragraph>A verify link will be send to your email.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <DialogButton
              label={loading ? 'Sending ...' : 'Send'}
              loading={loading}
              disabled={loading}
              onPress={handleEmailVerify}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  verifiedText: {color: '#1fbb00', fontWeight: 'bold'},
  verifiedStyle: {
    borderColor: '#1fbb00',
    borderWidth: 1,
    backgroundColor: '#00000000',
  },
  verifyText: {color: '#bb0000', fontWeight: 'bold'},
  verifyStyle: {
    borderColor: '#bb0000',
    borderWidth: 1,
    backgroundColor: '#00000000',
  },
});

export default EmailVerifyChip;
