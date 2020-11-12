import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, StackActions } from '@react-navigation/native';
import axios from 'axios';
import { Button, Form, Input, Item, Toast, Text as NBText } from 'native-base';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import { Entypo } from "@expo/vector-icons";

import { useTypedSelector } from '../../helpers/hooks/typed-selector.hook';
import { authService } from '../../services/auth.service';
import { inputStyle } from '../../styles/input.style';

const styles = StyleSheet.create({
  inputDesc: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 32,
  },
  submitBtn: {
    marginTop: 16,
  },
});
export const PasswordForm = () => {
  const navigation = useNavigation();

  const [password, setPassword] = useState('');
  const [passView, setpassView] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isConfirm, setIsConfirm] = useState(false);

  const confirmCode = useTypedSelector((state) => state.auth.confirmCode);
  const iin = useTypedSelector((state) => state.auth.restorePassword.iin);

  const handleSubmit = async () => {
    if (!confirmPassword) {
      setIsConfirm(true);
    } else {
      const isSuccess = await authService.resetPassword({
        code: confirmCode,
        confirm_password: confirmPassword,
        iin,
        password,
      });

      if (isSuccess.success === false) {
        setConfirmPassword('');
        setPassword('');
        setIsConfirm(false);
        Toast.show({
          text: isSuccess.message,
          type: 'danger',
          duration: 7000,
        });
      } else {
        if (isSuccess.sessionId) {
          const { data: userData } = await axios.get('getUserData?h=ast2', {
            headers: {
              token: isSuccess.sessionId,
            },
          });

          await AsyncStorage.setItem('user_data', JSON.stringify(userData));
          await AsyncStorage.setItem('token', isSuccess.sessionId);
          navigation.dispatch(StackActions.replace('Home'));
        } else {
          Toast.show({
            text: 'Ошибка автоматического входа! Пожалуйста авторизуйтесь',
            type: 'danger',
            duration: 7000,
          });
          navigation.dispatch(StackActions.replace('Login'));
        }
      }
    }
  };

  useEffect(() => {
    Toast.hide();
  }, [password]);

  const ShowHidePass = () => {
    if (passView){
      setpassView(false);
    }else{
      setpassView(true);
    }
  }

  return (
    <>
      <Text style={styles.inputDesc}>
        {isConfirm ? 'Повторите' : 'Введите новый'} пароль:
      </Text>
      <Form>
        <Item regular style={inputStyle.inputItem}>
          {isConfirm ? (
            <Input
                secureTextEntry={passView}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
          ) : (
            <Input
                secureTextEntry={passView}
              onChangeText={setPassword}
              value={password}
            />
          )}
          <TouchableOpacity style={{ marginRight: 10}} onPress={ShowHidePass}>
            {
              passView ? (
                  <Entypo name="eye-with-line" size={24} color="black" />
              ) : (
                  <Entypo name="eye" size={24} color="black" />
              )
            }
          </TouchableOpacity>
        </Item>
      </Form>
      <Button style={styles.submitBtn} block onPress={handleSubmit}>
        <NBText>Продолжить</NBText>
      </Button>
    </>
  );
};
