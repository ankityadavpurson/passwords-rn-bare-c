import React, {useContext, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Paragraph, Dialog, Portal, FAB} from 'react-native-paper';
import {AuthContext} from '../context/auth';
import {normalize} from '../utils/responsive';
import DialogButton from './DialogButton';

const LogoutFAB = () => {
  const styles = useStyles();
  const authCtx = useContext(AuthContext);

  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <>
      <FAB
        style={styles.fab}
        label="Logout"
        icon="logout"
        onPress={() => showDialog()}
      />
      <Portal>
        <Dialog
          visible={visible}
          dismissable={!authCtx.loading}
          onDismiss={hideDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Do you want logout?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <DialogButton
              label="Cancel"
              disabled={authCtx.loading}
              onPress={hideDialog}
            />
            <DialogButton
              label="Logout"
              loading={authCtx.loading}
              disabled={authCtx.loading}
              onPress={() => authCtx.logout()}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: normalize(16),
      right: 0,
      bottom: 0,
    },
  });
};

export default LogoutFAB;
