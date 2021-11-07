import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import React, {useContext, useState} from 'react';
import {
  Avatar,
  Card,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
} from 'react-native-paper';
import {AuthContext} from '../context/auth';
import {decipher} from '../crypto';
import {showToastLong} from '../utils/toast';
import DialogButton from '../components/DialogButton';
const RNFS = require('react-native-fs');

const BackupCard = props => {
  const authCtx = useContext(AuthContext);

  const [loadingFile, setLoadingFile] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const getSnapshotData = snapshot => {
    return `
username: ${snapshot.data().username}
value: ${decipher(snapshot.data().value, authCtx.key)}
link: ${snapshot.data().link}
`;
  };

  async function handleSavePassword() {
    try {
      setLoadingFile(true);
      const result = await firestore().collection(auth().currentUser.uid).get();
      const passwordData = result.docs.map(getSnapshotData).join('...');
      const path =
        RNFS.DownloadDirectoryPath + `/passwords_${new Date().getTime()}.txt`;
      await RNFS.writeFile(path, passwordData, 'utf8');
      setLoadingFile(false);
      setOpenDialog(false);
      showToastLong(`Your passwords are saved - ${path}`);
    } catch (error) {
      setLoadingFile(false);
      showToastLong('Error saving passwords.');
      crashlytics().recordError(error, 'Error saving passwords.');
    }
  }

  return (
    <>
      <Card.Title
        title="Backup"
        subtitle="Save your passwords in a local file."
        left={props => <Avatar.Icon {...props} icon="backup-restore" />}
        right={props => (
          <IconButton
            {...props}
            icon="content-save"
            onPress={() => setOpenDialog(true)}
          />
        )}
      />

      <Portal>
        <Dialog
          visible={openDialog}
          dismissable={!loadingFile}
          onDismiss={() => setOpenDialog(false)}>
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              The passwords will be saved in text file unencrypted.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <DialogButton
              label="Cancel"
              disabled={loadingFile}
              onPress={() => setOpenDialog(false)}
            />
            <DialogButton
              label="Save"
              loading={loadingFile}
              disabled={loadingFile}
              onPress={handleSavePassword}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default BackupCard;
