import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import {normalize} from '../utils/responsive';

const TitleLogo = props => {
  const styles = useStyles();
  return (
    <>
      <Text style={styles.headline}>Passwords</Text>
      <Text style={styles.headline}>*****</Text>
    </>
  );
};
const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    headline: {
      fontSize: normalize(36),
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
  });
};

export default TitleLogo;
