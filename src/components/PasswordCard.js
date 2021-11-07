import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import {
  Card,
  Avatar,
  IconButton,
  Paragraph,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import {AuthContext} from '../context/auth';
import {SettingsContext} from '../context/settings';
import {asterisk, decipher} from '../crypto';
import {normalize} from '../utils/responsive';

const PasswordCard = props => {
  const password = props.password;
  const settingsCtx = useContext(SettingsContext);
  const authCtx = useContext(AuthContext);

  const [viewPassword, setViewPassword] = useState(false);

  return (
    <Card style={{marginVertical: normalize(5)}}>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <TouchableRipple
          onPress={() => props.onPress(password)}
          style={{
            width: settingsCtx.visibleButton ? '80%' : '100%',
            display: 'flex',
            flexDirection: 'row',
          }}>
          <>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Avatar.Text
                size={40}
                label={password.name.slice(0, 1).toUpperCase()}
              />
            </View>
            <View style={{width: '75%', paddingVertical: normalize(5)}}>
              <Title>{password.name}</Title>
              {!settingsCtx.asterisked ? (
                <Paragraph>{decipher(password.value, authCtx.key)}</Paragraph>
              ) : (
                <Paragraph>
                  {viewPassword
                    ? decipher(password.value, authCtx.key)
                    : asterisk(password.value)}
                </Paragraph>
              )}
            </View>
          </>
        </TouchableRipple>
        {settingsCtx.visibleButton && (
          <TouchableRipple
            style={{
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => setViewPassword(!viewPassword)}>
            <IconButton size={25} icon={viewPassword ? 'eye' : 'eye-off'} />
          </TouchableRipple>
        )}
      </View>
    </Card>
  );
};

export default PasswordCard;
