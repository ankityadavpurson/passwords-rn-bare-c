import React from 'react';
import {StyleSheet, View} from 'react-native';
import {HelperText, TextInput as TextInputPaper} from 'react-native-paper';

import {normalize} from '../utils/responsive';

const InputField = props => {
  const styles = useStyles();

  return (
    <>
      <View style={styles.textInputContainer}>
        <TextInputPaper
          autoCorrect={false}
          autoCompleteType={'off'}
          secureTextEntry={props.secureTextEntry}
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
    helperText: {
      marginBottom: normalize(6),
      textAlign: 'left',
      width: '100%',
    },
  });
};

export default InputField;
