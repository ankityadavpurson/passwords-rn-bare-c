import auth from '@react-native-firebase/auth';
import crashlytics from '@react-native-firebase/crashlytics';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ActivityIndicator, Button, useTheme} from 'react-native-paper';
import {AuthContext} from '../context/auth';
import {normalize} from '../utils/responsive';
import {showToastLong} from '../utils/toast';

GoogleSignin.configure({
  webClientId:
    '796267227353-m1c6t71m98honfb6hp564utupuq2bk5d.apps.googleusercontent.com',
});

const EntryButtons = props => {
  const styles = useStyles();
  const authCtx = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  async function handleGoogleButton() {
    try {
      setLoading(true);
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );
      setLoading(false);
      authCtx.setUserCredential(userCredential);
      showToastLong('Signed in with Google!');
    } catch (error) {
      crashlytics().recordError(error);
      setLoading(false);
      showToastLong('Error in signing with Google!');
    }
  }

  return (
    <View>
      {loading && (
        <View style={styles.loadingView}>
          <ActivityIndicator size={40} />
          <Text style={styles.loadingText}>loading ...</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          icon="google"
          style={styles.button}
          mode="outlined"
          uppercase={false}
          onPress={handleGoogleButton}>
          <Text style={styles.buttonFont}>Google</Text>
        </Button>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode="contained"
          uppercase={false}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.buttonFont}>Login</Text>
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          uppercase={false}
          onPress={() => props.navigation.navigate('Signup')}>
          <Text style={styles.buttonFont}>Signup</Text>
        </Button>
      </View>
    </View>
  );
};

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    loadingView: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      zIndex: 99,
      justifyContent: 'center',
      alignContent: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      textAlign: 'center',
      fontSize: normalize(15),
      margin: normalize(10),
    },
    buttonContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      zIndex: 0,
    },
    button: {
      flex: 1,
      margin: normalize(8),
      borderWidth: normalize(2),
    },
    buttonFont: {
      fontSize: normalize(13),
    },
  });
};

export default EntryButtons;
