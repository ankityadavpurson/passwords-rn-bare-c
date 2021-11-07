import React from 'react';
import {Button, useTheme} from 'react-native-paper';

const DialogButton = props => {
  const theme = useTheme();
  return (
    <Button
      loading={props.loading}
      disabled={props.disabled}
      onPress={props.onPress}
      color={theme.colors.accent}>
      {props.label}
    </Button>
  );
};

export default DialogButton;
