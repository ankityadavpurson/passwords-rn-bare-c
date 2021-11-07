import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import React, {useContext, useState} from 'react';
import {Dialog, IconButton, Paragraph, Portal} from 'react-native-paper';

import {showToastLong} from '../utils/toast';
import {AuthContext} from '../context/auth';
import DialogButton from './DialogButton';

const DeletePasswordButton = props => {
  const authCtx = useContext(AuthContext);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const showDeleteDialog = () => setDeleteDialog(true);
  const hideDeleteDialog = () => setDeleteDialog(false);

  async function handlePasswordDelete() {
    try {
      setLoading(true);
      await firestore().collection(authCtx.user.uid).doc(props.id).delete();
      showToastLong('Password deleted');
      setLoading(false);
      hideDeleteDialog();
      props.onDelete();
    } catch (error) {
      crashlytics().recordError(error, 'Error deleting password');
      showToastLong('Error deleting password');
    }
  }

  return (
    <>
      <IconButton
        icon="delete"
        size={props.size}
        onPress={() => showDeleteDialog()}
      />

      <Portal>
        <Dialog
          visible={deleteDialog}
          dismissable={!loading}
          onDismiss={hideDeleteDialog}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Do you want delete password?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <DialogButton
              label="Cancel"
              disabled={loading}
              onPress={hideDeleteDialog}
            />
            <DialogButton
              label="Delete"
              loading={loading}
              disabled={loading}
              onPress={handlePasswordDelete}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default DeletePasswordButton;
