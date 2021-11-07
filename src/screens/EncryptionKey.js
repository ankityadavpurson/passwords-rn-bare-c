import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useContext, useRef, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Card, Paragraph, useTheme} from 'react-native-paper';

import CustomButton from '../components/CustomButton';
import LogoutFAB from '../components/LogoutFAB';
import ScreenTitle from '../components/ScreenTitle';
import SecureInputField from '../components/SecureInputField';
import {AuthContext} from '../context/auth';
import {hash} from '../crypto';
import {normalize} from '../utils/responsive';
import {showToastShort} from '../utils/toast';

const EncryptionKey = props => {
  const styles = useStyles();
  const keyInputRef = useRef(null);
  const authCtx = useContext(AuthContext);

  const [key, setKey] = useState({value: '', error: ''});
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserKey();
    async function getUserKey() {
      const keyDocument = await firestore()
        .collection('keys')
        .where('uid', '==', auth().currentUser.uid)
        .get();

      setIsNewUser(keyDocument.docs.length === 0);
    }
  }, []);

  function validateKey(key) {
    setKey(u => ({...u, error: ''}));
    if (key.value.trim() === '') {
      keyInputRef.current?.focus();
      setKey(p => ({...p, error: 'key is required'}));
      return false;
    }

    if (key.value.trim().length < 8) {
      keyInputRef.current?.focus();
      setKey(p => ({...p, error: 'key is too small'}));
      return false;
    }

    if (key.value.trim().length > 20) {
      keyInputRef.current?.focus();
      setKey(p => ({...p, error: 'key is too larg'}));
      return false;
    }

    return true;
  }

  async function handleSubmitKey() {
    try {
      const valid = validateKey(key);
      if (valid) {
        setLoading(true);
        keyInputRef.current?.blur();
        if (isNewUser) await addNewKey();
        else await verifyKey();
      }
    } catch (error) {
      crashlytics().recordError(error, 'Submit encryption key error');
      setLoading(false);
      showToastShort('Submit encryption key error');
    }
  }

  async function addNewKey() {
    const currentTime = new Date().getTime().toString();
    const keyData = {
      hash: hash(key.value),
      uid: auth().currentUser.uid,
      createdAt: currentTime,
      lastUsed: currentTime,
    };

    const keyDocument = await firestore().collection('keys').add(keyData);
    setLoading(false);

    delete keyData.hash;
    authCtx.setEncryptionKey({
      ...keyData,
      id: keyDocument.id,
      value: key.value,
    });
    showToastShort('Your key is saved');
  }

  async function verifyKey() {
    const currentTime = new Date().getTime().toString();
    const keyDocument = await firestore()
      .collection('keys')
      .where('uid', '==', auth().currentUser.uid)
      .get();

    const keyData = {
      ...keyDocument.docs[0].data(),
      id: keyDocument.docs[0].id,
      value: key.value,
    };

    const validHash = hash(key.value) === keyData.hash;

    if (validHash) {
      await firestore().collection('keys').doc(keyData.id).update({
        lastUsed: currentTime,
      });

      setLoading(false);

      delete keyData.hash;
      authCtx.setEncryptionKey({...keyData, lastUsed: currentTime});

      showToastShort('Your key is verified');
    } else {
      setLoading(false);
      setKey(p => ({...p, error: 'key is not valid.'}));
      showToastShort('key is not valid.');
    }
  }

  return (
    <View style={styles.container}>
      {auth().currentUser ? (
        <>
          <Button>{`Welcome${isNewUser ? ' ' : ' back '}${
            auth().currentUser.displayName
          }`}</Button>
          <Button icon="alert" uppercase={false}>
            This is important
          </Button>
          <ScreenTitle
            title={`Enter your${isNewUser ? ' new ' : ' '}encryption key`}
            size={26}
          />
          <SecureInputField
            openEye
            mode="outlined"
            label="Key"
            returnKeyType="done"
            value={key.value}
            error={key.error}
            refs={keyInputRef}
            onSubmitEditing={handleSubmitKey}
            onChangeText={value => setKey({value, error: ''})}
          />
          <View style={styles.buttonContainer}>
            <CustomButton
              text="Submit"
              mode="contained"
              loading={loading}
              disabled={loading}
              onPress={handleSubmitKey}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Card.Content>
              <Paragraph style={styles.helperTextPara}>
                * This can be a simple phrase or anything which you can not
                forget. e.g.: your cat name.
              </Paragraph>
              <Paragraph style={styles.helperTextPara}>
                * This should be at least eight characters long and should not
                go more than 20.
              </Paragraph>
              <Paragraph style={styles.helperTextPara}>
                * Do not share this with anyone.
              </Paragraph>
              <Paragraph style={styles.helperTextPara}>
                * This will be used to encrypt and decrypt your password.
              </Paragraph>
              <Paragraph style={styles.helperTextPara}>
                * Save this somewhere safe for feature login. We will ask you
                this all the time, once you login.
              </Paragraph>
              <Paragraph style={styles.helperTextPara}>
                * This key will be saved in our database in hashed form for the
                next verification.
              </Paragraph>
              <Paragraph style={styles.helperTextPara} />
              <Paragraph style={styles.helperTextPara} />
            </Card.Content>
          </ScrollView>
        </>
      ) : (
        <ScreenTitle title={`You are not authenticated`} size={26} />
      )}
      {!loading && <LogoutFAB />}
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    helperTextHeading: {
      color: theme.colors.placeholder,
      fontSize: normalize(15),
    },
    helperTextPara: {
      color: theme.colors.placeholder,
      lineHeight: normalize(17),
      marginBottom: normalize(5),
    },
  });
};

export default EncryptionKey;
