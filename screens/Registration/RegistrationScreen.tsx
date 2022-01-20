import { Container, Content, Footer, H2, Text } from 'native-base';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  ImageBackground,
  ScrollViewComponent,
  StyleSheet,
  View,
  ScrollView,
  Linking,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { authScreenStyles } from '../../components/AuthScreenWrapper';
import { useTypedSelector } from '../../helpers/hooks/typed-selector.hook';
import { ConfirmCodeForm } from './ConfirmCodeForm';
import { PasswordForm } from './PasswordForm';
import { RegistrationForm } from './RegistrationForm';

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

export const RegistrationScreen = () => {
  const [mode, setMode] = useState(Mode.REGISTRATION);
  const registrationPhone = useTypedSelector(
    (state) => state.auth.registration.phone
  );
  const confirmCode = useTypedSelector((state) => state.auth.confirmCode);

  useEffect(() => {
    if (registrationPhone) {
      setMode(Mode.CONFIRM_CODE);
    }
  }, [registrationPhone]);

  useEffect(() => {
    if (confirmCode) {
        setMode(Mode.PASSWORD);
    }
  }, [confirmCode]);


  return (
    <ImageBackground
      source={require('../../assets/design/home/back.png')}
      style={authScreenStyles.image}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-around',
            paddingHorizontal: 20,
          }}>
          <View></View>
          <View style={{ marginTop: 150 }}>
            <H2 style={styles.header}>Регистрация</H2>
            {mode === Mode.REGISTRATION && <RegistrationForm />}
            {mode === Mode.CONFIRM_CODE && (
              <ConfirmCodeForm phone={registrationPhone} />
            )}
            {mode === Mode.PASSWORD && <PasswordForm />}
          </View>
          <View>
            <Text
              style={authScreenStyles.textPhone}
              onPress={() => {
                Linking.openURL('tel:87777777777');
              }}>
              Телефон технической поддержки:{'\n'}8-(777)-777-77-77
            </Text>
            <Text
              style={authScreenStyles.textPhone}
              onPress={() => {
                Linking.openURL('mailto:support@smart24.kz');
              }}>
              {'\n'}
              support@smart24.kz
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
