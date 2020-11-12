import { Button, Form, Item, Text } from 'native-base';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { IdInput } from '../../components/IdInput';
import { useAppDispatch } from '../../helpers/hooks/app-dispatch.hook';
import { refreshCodeAction } from '../../redux/auth.actions';
import { inputStyle } from '../../styles/input.style';

const styles = StyleSheet.create({
  submitBtn: {
    marginTop: 16,
  },
});
export const UserDataForm = () => {
  const dispatch = useAppDispatch();

  const [login, setLogin] = useState<string>('');

  const validLogin = login.replace(/-/g, '');
  const isCanSubmit: boolean = validLogin.length === 12;

  const handleSubmit = async () => {
    dispatch(
      refreshCodeAction({
        iin: validLogin,
      })
    );
  };

  return (
    <>
      <Form>
        <Item regular style={inputStyle.inputItem}>
          <IdInput onChangeText={(text) => setLogin(text)} value={login} />
        </Item>
      </Form>
      <Button
        block
        onPress={handleSubmit}
        style={styles.submitBtn}
        disabled={!isCanSubmit}>
        <Text>Продолжить</Text>
      </Button>
    </>
  );
};
