import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {ActivityIndicator, Text, useTheme} from 'react-native-paper';

import EntryButtons from '../components/EntryButtons';
import TitleLogo from '../components/TitleLogo';
import {AuthContext} from '../context/auth';
import {normalize} from '../utils/responsive';

const Start = props => {
  const styles = useStyles();
  const authCtx = useContext(AuthContext);
  return (
    <View style={styles.container}>
      {authCtx.loading ? (
        <>
          <ActivityIndicator size={50} />
          <Text style={{fontSize: normalize(20)}}>Loading ...</Text>
        </>
      ) : (
        <>
          <TitleLogo />
          <EntryButtons navigation={props.navigation} />
          <View style={{height: 30}} />
          <Text style={styles.copyrightText}>Save your Passwords</Text>
        </>
      )}
    </View>
  );
};

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: normalize(15),
      backgroundColor: theme.colors.background,
    },
    copyrightText: {
      color: theme.colors.primary,
    },
  });
};

export default Start;
