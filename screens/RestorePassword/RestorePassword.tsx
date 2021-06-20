import { H2 } from 'native-base';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { AuthScreenWrapper } from '../../components/AuthScreenWrapper';
import { useTypedSelector } from '../../helpers/hooks/typed-selector.hook';
import { ConfirmCodeForm } from './ConfirmCodeForm';
import { PasswordForm } from './PasswordForm';
import { UserDataForm } from './UserDataForm';

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#a2a3b7',
  },
  submitBtn: {
    marginTop: 16,
  },
});
enum Mode {
  REGISTRATION,
  CONFIRM_CODE,
  PASSWORD,
}
export const RestorePassword = () => {
  const [mode, setMode] = useState(Mode.REGISTRATION);

  const iin = useTypedSelector((state) => state.auth.restorePassword.iin);
  useEffect(() => {
    if (iin) {
      setMode(Mode.CONFIRM_CODE);
    }
  }, [iin]);

  const confirmCode = useTypedSelector((state) => state.auth.confirmCode);
  useEffect(() => {
    if (confirmCode) {
      setMode(Mode.PASSWORD);
    }
  }, [confirmCode]);

  return (
    <AuthScreenWrapper>
      <H2 style={styles.header}>Восстановление пароля</H2>
      {mode === Mode.REGISTRATION && <UserDataForm />}
      {mode === Mode.CONFIRM_CODE && <ConfirmCodeForm />}
      {mode === Mode.PASSWORD && <PasswordForm />}
    </AuthScreenWrapper>
  );
};
