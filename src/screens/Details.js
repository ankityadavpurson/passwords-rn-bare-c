import Clipboard from '@react-native-clipboard/clipboard';
import firestore from '@react-native-firebase/firestore';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, IconButton, Paragraph, Title, useTheme} from 'react-native-paper';

import GoBack from '../components/GoBack';
import ScreenTitle from '../components/ScreenTitle';
import {SettingsContext} from '../context/settings';
import {normalize} from '../utils/responsive';
import {showToastLong} from '../utils/toast';
import {asterisk, decipher} from '../crypto';
import {AuthContext} from '../context/auth';
import DeletePasswordButton from '../components/DeletePasswordButton';

const Details = props => {
  const PASSWORD = props.route.params;
  const styles = useStyles();
  const settingsCtx = useContext(SettingsContext);
  const authCtx = useContext(AuthContext);

  const [password, setPassword] = useState(PASSWORD);
  const [viewPassword, setViewPassword] = useState(false);

  useEffect(() => {
    const subscriber = firestore()
      .collection(authCtx.user.uid)
      .doc(password.id)
      .onSnapshot(documentSnapshot => {
        const passwordDoc = documentSnapshot.data();
        setPassword(p => ({...p, ...passwordDoc}));
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return (
    <View style={styles.container}>
      <ScreenTitle title="Details" size={26} />

      <Card>
        <Card.Content style={styles.cardContent}>
          <Paragraph>Name</Paragraph>
          <Title>{password.name}</Title>
        </Card.Content>

        <Card.Content style={styles.cardContent}>
          <Paragraph>Uaername</Paragraph>
          <Title>{password.username}</Title>
        </Card.Content>

        <Card.Content style={styles.cardContent}>
          <Paragraph>Link</Paragraph>
          <Title>{password.link}</Title>
        </Card.Content>

        <Card.Content style={styles.cardContent}>
          <Paragraph>Value</Paragraph>
          {settingsCtx.asterisked ? (
            <Title>
              {viewPassword
                ? decipher(password.value, authCtx.key)
                : asterisk(password.value)}
            </Title>
          ) : (
            <Title>{decipher(password.value, authCtx.key)}</Title>
          )}
        </Card.Content>

        <Card.Content style={styles.cardContent}>
          <Paragraph>Created At</Paragraph>
          <Title>
            {new Date(parseInt(password.createdAt)).toLocaleString()}
          </Title>
        </Card.Content>

        <Card.Content style={styles.cardContent}>
          <Paragraph>Updated At</Paragraph>
          <Title>
            {new Date(parseInt(password.updatedAt)).toLocaleString()}
          </Title>
        </Card.Content>

        <Card.Actions style={styles.cardActions}>
          {settingsCtx.asterisked && (
            <IconButton
              icon={viewPassword ? 'eye' : 'eye-off'}
              size={31}
              onPress={() => setViewPassword(!viewPassword)}
            />
          )}

          <IconButton
            icon="content-copy"
            size={31}
            onPress={() => {
              Clipboard.setString(decipher(password.value, authCtx.key));
              showToastLong('Password copied to clipboard.');
            }}
          />

          <IconButton
            icon="square-edit-outline"
            size={31}
            onPress={() => props.navigation.navigate('PasswordForm', password)}
          />

          <DeletePasswordButton
            size={31}
            id={password.id}
            onDelete={() => props.navigation.goBack()}
          />
        </Card.Actions>
      </Card>

      <GoBack />
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
    cardContent: {marginVertical: normalize(6)},
    cardActions: {
      marginVertical: normalize(6),
      justifyContent: 'space-between',
    },
  });
};

export default Details;
