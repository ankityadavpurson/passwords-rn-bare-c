import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  HelperText,
  IconButton,
  TextInput as TextInputPaper,
} from 'react-native-paper';

import {normalize} from '../utils/responsive';

const SecureInputField = props => {
  const styles = useStyles();

  const [inSecure, setInSecure] = useState(props.openEye);

  return (
    <>
      <View style={styles.textInputContainer}>
        <TextInputPaper
          secureTextEntry={!inSecure}
          autoCorrect={false}
          autoCompleteType="off"
          autoCapitalize="none"
          keyboardType={props.keyboardType}
          returnKeyType={props.returnKeyType}
          mode={props.mode}
          label={props.label}
          value={props.value}
          onChangeText={props.onChangeText}
          ref={props.refs}
          onSubmitEditing={props.onSubmitEditing}
          style={styles.textInput}
        />
        {!props.noicon && (
          <View style={styles.eyeButton}>
            <IconButton
              icon={inSecure ? 'eye' : 'eye-off'}
              size={30}
              onPress={() => setInSecure(!inSecure)}
            />
          </View>
        )}
      </View>
      {!!props.error && (
        <HelperText style={styles.helperText} type="error">
          {props.error}
        </HelperText>
      )}
    </>
  );
};

const useStyles = () => {
  return StyleSheet.create({
    textInputContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginVertical: normalize(3),
    },
    textInput: {flex: 1},
    eyeButton: {
      position: 'absolute',
      top: normalize(6),
      right: 0,
      zIndex: 99,
    },
    helperText: {
      marginBottom: normalize(6),
      textAlign: 'left',
      width: '100%',
    },
  });
};

export default SecureInputField;
