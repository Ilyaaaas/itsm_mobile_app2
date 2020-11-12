import { Button, Form, Input, Item, Text, Toast } from 'native-base';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

import { SecondaryButton } from '../../components/SecondaryButton';
import { useAppDispatch } from '../../helpers/hooks/app-dispatch.hook';
import { useTypedSelector } from '../../helpers/hooks/typed-selector.hook';
import { acceptRegistrationCodeAction } from '../../redux/auth.actions';
import { authService } from '../../services/auth.service';
import { inputStyle } from '../../styles/input.style';

const styles = StyleSheet.create({
  timerText: {
    textAlign: 'center',
  },
  submitBtn: {
    marginTop: 16,
  },
});
const TIMER_COUNT = 4 * 60;
const getTimerText = (timer: number) => {
  const minutes = Math.floor(timer / 60);
  const seconds = timer - minutes * 60;
  return `${minutes >= 10 ? minutes : `0${minutes}`}:${
    seconds >= 10 ? seconds : `0${seconds}`
  }`;
};
export const ConfirmCodeForm = () => {
  const dispatch = useAppDispatch();

  const [code, setCode] = useState('');

  const [timer, setTimer] = useState(TIMER_COUNT);
  useEffect(() => {
    const interval = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const iin = useTypedSelector((state) => state.auth.restorePassword.iin);

  const handleResendCode = async () => {
    const resendCodeResponse = await authService.resendCode({
      iin,
    });
    if (resendCodeResponse.success) {
      setTimer(TIMER_COUNT);
    }
  };

  const handleAcceptCode = () => {
    dispatch(
      acceptRegistrationCodeAction({
        iin,
        code,
      })
    );
  };

  const isFailedAcceptingCode = useTypedSelector(
    (state) => state.auth.isFailedAcceptingCode
  );
  useEffect(() => {
    if (isFailedAcceptingCode) {
      Toast.show({ text: 'Код авторизации не совпадает', type: 'danger' });
      setCode('');
    }
  }, [isFailedAcceptingCode]);

  const message = useTypedSelector(
    (state) => state.auth.restorePassword.message
  );

  return (
    <>
      <Text>{message}</Text>
      <Form>
        <Item regular style={inputStyle.inputItem}>
          <TextInputMask
            type="custom"
            keyboardType="numeric"
            placeholder="Код"
            customTextInput={Input}
            options={{ mask: '9999' }}
            onChangeText={(text) => setCode(text)}
            value={code}
          />
        </Item>
      </Form>
      {timer ? (
        <Text style={styles.timerText}>
          Выслать код повторно через {getTimerText(timer)}
        </Text>
      ) : (
        <SecondaryButton onPress={handleResendCode}>
          Выслать код повторно
        </SecondaryButton>
      )}
      <Button
        disabled={code.length !== 4}
        block
        style={styles.submitBtn}
        onPress={handleAcceptCode}>
        <Text>Продолжить</Text>
      </Button>
    </>
  );
};
