import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, IconButton, Paragraph, Title} from 'react-native-paper';

import {normalize} from '../utils/responsive';
import asyncStore from '../utils/asyncStore';
import {plocaleString} from '../utils/time';

const KeyDetails = () => {
  const styles = useStyles();

  const [encryptionKey, setEncryptionKey] = useState(null);
  const [showKey, setShowKey] = useState(false);

  async function showEncryptionKeyData() {
    const keyData = await asyncStore.getStoredKey();
    setEncryptionKey(JSON.parse(keyData));
  }

  function hideEncryptionKeyData() {
    setShowKey(false);
    setEncryptionKey(null);
  }

  return (
    <>
      <Card.Title
        style={styles.viewBtn}
        title="Encryption Key"
        right={props => (
          <IconButton
            {...props}
            size={30}
            animated
            icon={!!encryptionKey ? 'chevron-up' : 'chevron-down'}
            onPress={
              !!encryptionKey ? hideEncryptionKeyData : showEncryptionKeyData
            }
          />
        )}
      />

      {encryptionKey && (
        <View>
          <View style={styles.viewValue}>
            <Card.Content style={styles.cardContent}>
              <Paragraph>Value</Paragraph>
              <Title>{showKey ? encryptionKey.value : '********'}</Title>
            </Card.Content>
            <IconButton
              icon={!!showKey ? 'eye' : 'eye-off'}
              onPress={() => setShowKey(!showKey)}
            />
          </View>

          <Card.Content style={styles.cardContent}>
            <Paragraph>Id</Paragraph>
            <Title>{encryptionKey.id}</Title>
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <Paragraph>Last Used</Paragraph>
            <Title>{plocaleString(encryptionKey.lastUsed)}</Title>
          </Card.Content>

          <Card.Content style={styles.cardContent}>
            <Paragraph>Created At</Paragraph>
            <Title>{plocaleString(encryptionKey.createdAt)}</Title>
          </Card.Content>
        </View>
      )}
    </>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    viewBtn: {marginRight: normalize(10)},
    cardContent: {marginVertical: normalize(6)},
    viewValue: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginRight: normalize(15),
    },
  });
};

export default KeyDetails;
