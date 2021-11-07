import React, {useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Avatar,
  Card,
  IconButton,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import GoBack from '../components/GoBack';
import ScreenTitle from '../components/ScreenTitle';
import {SettingsContext} from '../context/settings';
import {ThemeContext} from '../context/theme';
import {normalize} from '../utils/responsive';
import BackupCard from '../components/BackupCard';

const Settings = props => {
  const styles = useStyles();
  const themectx = useContext(ThemeContext);
  const settingsCtx = useContext(SettingsContext);

  return (
    <View style={styles.container}>
      <ScreenTitle title="Settings" size={26} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.subSetingsTitle}>{`Cloud & Backup`}</Text>
        <Card.Title
          title="Sync Now"
          subtitle="Sync your all loacal saved passwords."
          left={props => <Avatar.Icon {...props} icon="sync" />}
          right={props => (
            <IconButton
              {...props}
              disabled
              icon="cloud-sync"
              onPress={() => {}}
            />
          )}
        />

        <BackupCard />

        <Text style={styles.subSetingsTitle}>Theme</Text>
        <Card.Title
          title="Theme"
          subtitle="Change the theme of app."
          left={props => (
            <Avatar.Icon
              {...props}
              icon={themectx.dark ? 'weather-night' : 'white-balance-sunny'}
            />
          )}
          right={props => (
            <IconButton
              {...props}
              animated
              icon={!themectx.dark ? 'weather-night' : 'white-balance-sunny'}
              onPress={() => themectx.change()}
            />
          )}
        />

        <Text style={styles.subSetingsTitle}>Password display</Text>
        <Card.Title
          title="Encrypt"
          subtitle="Save your local passwords encrypted."
          left={props => <Avatar.Icon {...props} icon="database-lock" />}
          right={props => (
            <Switch
              {...props}
              disabled
              value={settingsCtx.localEncryption}
              onValueChange={value => settingsCtx.changeLocalEncryption(value)}
            />
          )}
        />

        <Card.Title
          title="Asterisked"
          subtitle={`Don't show full password on password list.`}
          left={props => <Avatar.Icon {...props} icon="asterisk" />}
          right={props => (
            <Switch
              {...props}
              value={settingsCtx.asterisked}
              onValueChange={value => settingsCtx.changeAsterisked(value)}
            />
          )}
        />

        <Card.Title
          title="Visible Button"
          subtitle="Remove visible buttons on password list."
          left={props => <Avatar.Icon {...props} icon="eye" />}
          right={props => (
            <Switch
              {...props}
              value={settingsCtx.visibleButton}
              disabled={!settingsCtx.asterisked}
              onValueChange={value => settingsCtx.changeVisibleButton(value)}
            />
          )}
        />

        <Text style={styles.subSetingsTitle}>Update</Text>
        <Card.Title
          title="Check for update"
          subtitle="Keep your app updated."
          left={props => <Avatar.Icon {...props} icon="google-play" />}
          right={props => (
            <IconButton
              {...props}
              disabled
              icon="download"
              onPress={() => {}}
            />
          )}
        />

        <Text style={styles.subSetingsTitle}>About</Text>
        <Card.Title title="Passwords version" subtitle="Version: 1.0.0 [S]" />
        <Card.Title title="" />
      </ScrollView>

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
    subSetingsTitle: {
      marginTop: normalize(5),
      fontSize: normalize(12),
      fontWeight: 'bold',
    },
  });
};

export default Settings;
