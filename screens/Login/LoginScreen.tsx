import { useNavigation, StackActions } from '@react-navigation/native';
import {Button, Form, Input, Item, Toast} from 'native-base';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Alert, AsyncStorage, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import { AuthScreenWrapper } from '../../components/AuthScreenWrapper';
import { IdInput } from '../../components/IdInput';
import { authService } from '../../services/auth.service';
import { inputStyle } from '../../styles/input.style';
import { Entypo } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

const styles = StyleSheet.create({
  secondaryButton: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    color: '#a2a3b7',
  },
  btnSubmit: {
    backgroundColor: '#db1430',
    marginTop: 2,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 3
  }
});
export const LoginScreen = () => {
  const navigation = useNavigation();
  const [passView, setpassView] = useState(true);
  //
  const [showIINS, setShowIINS] = useState(false);
  const [listLogins, setListLogins] = useState([]);
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordRecoveryIsVisible, setPasswordRecoveryIsVisible] = useState<boolean>(false);

  const handleSubmit = async (onSaveLogin = false) => {
    let pushtoken = '';
    try{
      const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status === "granted") {
        const expoPushTokenResponse = await Notifications.getExpoPushTokenAsync();
        pushtoken = expoPushTokenResponse.data;
      }
    }catch(e){
      Alert.alert(e.toLocaleString());
    }

    const isLoggedIn = await authService.login({
      login: login.replace(/-/g, ''),
      password,
      pushToken: pushtoken
    });
    if (isLoggedIn) {
      if(onSaveLogin) {
        // let getLogin = await AsyncStorage.getItem('login_save');
        // let lst = [];
        // if(getLogin !== null){
        //   lst = JSON.parse(getLogin);
        // }
        //
        // let setLst = {
        //   'iin': login,
        //   'pass': password,
        //   'activ': 1
        // }
        //
        // if (lst.length > 0) {
        //   if(lst.every((item: { iin: string; pass: string; }) => item.iin !== login && item.pass !== password)){
        //     lst.push(setLst);
        //   }
        // } else {
        //   lst.push(setLst);
        // }
        //
        // for(var i=0; i<lst.length;i++){
        //   if(lst[i].iin !== login && lst[i].pass !== password){
        //     lst[i].activ = 0;
        //   }else{
        //     lst[i].activ = 1;
        //   }
        // }
        //
        // let loginList = JSON.stringify(lst);
        // AsyncStorage.setItem('login_save', loginList);
        navigation.dispatch(StackActions.replace('Home'));
      }else{
        navigation.dispatch(StackActions.replace('Home'));
      }
    } else {
      navigation.dispatch(StackActions.replace('Home'));
      // setPasswordRecoveryIsVisible(true);
    }
  };

  const AlertShow = async () => {
    Alert.alert(
        "Сохранение данных",
        "Желаете ли Вы сохранить введенные данные на текущем устройстве?",
        [
          {
            text: "Нет",
            onPress: () => {
              handleSubmit(false);
            },
            style: "cancel"
          },
          { text: "Да", onPress: () => {
              handleSubmit(true);
            }
          }
        ],
        { cancelable: false }
    );
  }

  const AlertSaveLogin = async () => {
    if(login.trim() == ''){
      Toast.show({
        text: 'Поле логин не может быть пустым!',
        type: 'danger',
      });
      return false;
    }

    if(password.trim() == ''){
      Toast.show({
        text: 'Поле Пароль не может быть пустым!',
        type: 'danger',
      });
      return false;
    }

    let getLogin = await AsyncStorage.getItem('login_save');
    let b = true;

    if(getLogin !== null) {
      let lst = JSON.parse(getLogin);
      if (lst.length > 0) {
        lst.map((e) => {
          if (e.iin == login && e.pass == password) {
            b = false;
          }
        });
      }

      if(b){
        AlertShow();
      }else{
        handleSubmit(true);
      }
    }else{
      AlertShow();
    }
  }

  const ShowHidePass = () => {
    setpassView(!passView);
  }

  const getUserLogin = async () => {
    const loginList = await AsyncStorage.getItem('login_save');

    if(loginList !== null) {
      let logineds = JSON.parse(loginList);

      logineds.map((e, i) => {
        if (e.activ) {
          if (e.activ == 1) {
            setLogin(e.iin);
            setPassword(e.pass);
          }
        }
        logineds[i].key = i;
      });

      setListLogins(logineds);
    }
  }

  useEffect(() => {
    getUserLogin();
  }, []);

  return (
    <AuthScreenWrapper>
      <Form style={{ zIndex: 2001, marginTop: 40}}>
        <Item regular style={inputStyle.inputItem}>
          {/*<IdInput onChangeText={(text) => setLogin(text)} value={login} />*/}
          <Input
              placeholder="Логин"
              onChangeText={(text) => setLogin(text)}
              value={login}
          />
        </Item>

        <Item regular style={inputStyle.inputItem}>
          <Input
            placeholder="Пароль"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={passView}
          />
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
      <Button
          transparent
          block
          onPress={() => navigation.navigate('RestorePassword')}>
        <Text style={styles.secondaryButton}>Восстановить пароль</Text>
      </Button>
      {/*{passwordRecoveryIsVisible && (*/}
      {/*)}*/}
      <TouchableOpacity
        style={[!passwordRecoveryIsVisible && { marginTop: 1, zIndex: 100 }] && styles.btnSubmit}
        onPress={AlertSaveLogin}
      >
        <Text style={{ color: '#ffff', textAlign: "center" }}>ВОЙТИ</Text>
      </TouchableOpacity>
      <Button
        transparent
        block
        onPress={() => navigation.navigate('Registration')}>
        <Text style={styles.secondaryButton}>Регистрация</Text>
      </Button>
    </AuthScreenWrapper>
  );
};
