import auth from '@react-native-firebase/auth';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Divider, Paragraph, Title, useTheme} from 'react-native-paper';

import GoBack from '../components/GoBack';
import ScreenTitle from '../components/ScreenTitle';
import {normalize} from '../utils/responsive';
import EmailVerifyChip from '../components/EmailVerifyChip';
import LogoutFAB from '../components/LogoutFAB';
import {localeString} from '../utils/time';
import KeyDetails from '../components/KeyDetails';

const Profile = props => {
  const styles = useStyles();
  const user = auth().currentUser;

  return (
    <View style={styles.container}>
      <ScreenTitle title="Profile" size={26} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {user && (
          <>
            <Card>
              <Card.Content style={styles.cardContent}>
                <Paragraph>Name</Paragraph>
                <Title>{user.displayName}</Title>
              </Card.Content>

              <Card.Content style={styles.cardContent}>
                <Paragraph>Email</Paragraph>
                <View style={styles.emailContainer}>
                  <Title>{user.email}</Title>
                  <EmailVerifyChip verified={user.emailVerified} />
                </View>
              </Card.Content>

              {user.phoneNumber && (
                <Card.Content style={styles.cardContent}>
                  <Paragraph>Phone Number</Paragraph>
                  <Title>{user.phoneNumber}</Title>
                </Card.Content>
              )}

              <Card.Content style={styles.cardContent}>
                <Paragraph>UID</Paragraph>
                <Title>{user.uid}</Title>
              </Card.Content>

              <Card.Content style={styles.cardContent}>
                <Paragraph>Last Login At</Paragraph>
                <Title>{localeString(user.metadata.lastSignInTime)}</Title>
              </Card.Content>

              <Card.Content style={styles.cardContent}>
                <Paragraph>Created At</Paragraph>
                <Title>{localeString(user.metadata.creationTime)}</Title>
              </Card.Content>

              <Card.Content style={styles.cardContent} />
              <Divider />

              <KeyDetails />
            </Card>
            <View style={{height: normalize(50)}} />
          </>
        )}
      </ScrollView>

      <LogoutFAB />
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
      marginHorizontal: normalize(10),
    },
    emailContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
};

export default Profile;
