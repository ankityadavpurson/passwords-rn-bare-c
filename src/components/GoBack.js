import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';
import {normalize} from '../utils/responsive';

const GoBack = () => {
  const styles = useStyles();
  const navigation = useNavigation();
  return (
    <FAB
      style={styles.fab}
      icon="keyboard-backspace"
      onPress={() => navigation.goBack()}
    />
  );
};

const useStyles = () => {
  return StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: normalize(16),
      left: 0,
      bottom: 0,
    },
  });
};

export default GoBack;
