import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Button} from 'react-native-paper';
import {normalize} from '../utils/responsive';

const CustomButton = props => {
  const styles = useStyles();
  return (
    <Button
      icon={props.icon}
      mode={props.mode}
      onPress={props.onPress}
      style={styles.button}
      uppercase={false}
      disabled={props.disabled}
      loading={props.loading}>
      <Text style={styles.buttonText}>{props.text}</Text>
    </Button>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    button: {
      flex: 1,
      marginVertical: normalize(8),
      borderWidth: normalize(2),
    },
    buttonText: {
      fontSize: normalize(13),
    },
  });
};

export default CustomButton;
