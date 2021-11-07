import React from 'react';
import {View} from 'react-native';
import {IconButton, Surface, Text, useTheme} from 'react-native-paper';
import {normalize} from '../utils/responsive';

const AddFirstPassword = props => {
  const theme = useTheme();
  return (
    <View style={{flex: 1}}>
      <Surface
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: normalize(20),
        }}>
        <Text
          style={{
            fontSize: normalize(15),
            marginVertical: normalize(10),
          }}>
          Save your first password
        </Text>
        <IconButton
          icon="plus"
          size={45}
          color="white"
          style={{backgroundColor: theme.colors.primary}}
          onPress={props.onAddPress}
        />
      </Surface>
    </View>
  );
};

export default AddFirstPassword;
