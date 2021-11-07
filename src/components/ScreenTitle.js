import React from 'react';
import {Text, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {normalize} from '../utils/responsive';

const ScreenTitle = props => {
  const theme = useTheme();
  return (
    <View style={{margin: normalize(10)}}>
      <Text
        style={{
          fontSize: normalize(props.size ? props.size : 30),
          fontWeight: 'bold',
          color: theme.colors.primary,
        }}>
        {props.title}
      </Text>
    </View>
  );
};

export default ScreenTitle;
