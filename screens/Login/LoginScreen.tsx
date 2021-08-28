import { useNavigation, StackActions } from '@react-navigation/native';
import {Button, Form, Input, Item, Toast} from 'native-base';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Alert, AsyncStorage, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import { AuthScreenWrapper } from '../../components/AuthScreenWrapper';
import { IdInput } from '../../components/IdInput';
import { authService } from '../../services/auth.service';
import { inputStyle } from '../../styles/input.style';
import { Entypo } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import {useRef} from "react";
import Constants from "expo-constants";

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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [passView, setpassView] = useState(true);
  const [showIINS, setShowIINS] = useState(false);
  const [listLogins, setListLogins] = useState([]);
  const [login, setLogin] = useState<string>('i.akhmetov@digital.sk.kz');
  const [password, setPassword] = useState<string>('Astana2022!');
  const [passwordRecoveryIsVisible, setPasswordRecoveryIsVisible] = useState<boolean>(false);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token)
      console.log('token');
      console.log(token);
    } else {
      // alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  const handleSubmit = async (onSaveLogin = false) => {
    let data = {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin',
      body: JSON.stringify({
        username: login,
        password: password,
        // username: 'i.akhmetov@digital.sk.kz',
        // password: 'Astana2022!',
        // username: 'a.iskaliyev@skbs.kz',
        // password: 'U7cXPraHSU',
        // username: 'b.rysbek@skbs.kz',
        // password: 'ec682c6',
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      }
    }

    fetch('http://api.smart24.kz/portal/v1/profile/login', data)
        // .then((response) => response.json())
        // .then((responseData) => {
        //   console.log(responseData)
        // })
        // .then(response => response.json())
        .then(response => response.json())
        .then(json => {
              if(json.accessToken === undefined)
              {
                alert('Введен неправильный пароль или логин');
              }
              else
              {
                console.log(json);
                setAccessTokenFunc('@accessToken', json.accessToken, json.userId, expoPushToken);
                navigation.dispatch(StackActions.replace('MainITSMScreen'));
              }
            }
        )
  };

  const setAccessTokenFunc = async (key, value, userId, expoPushToken) => {
    AsyncStorage.clear();

    try {
      // await AsyncStorage.setItem(key, value);
      const items = [{"accessToken": value}, {"userId": userId}, {"exponentPushToken": expoPushToken}];
      await AsyncStorage.setItem("accessToken", JSON.stringify(items));
    } catch(e) {
      console.log('error');
    }
    console.log('Done')
  }

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
    // if(login.trim() == ''){
    //   Toast.show({
    //     text: 'Поле логин не может быть пустым!',
    //     type: 'danger',
    //   });
    //   return false;
    // }
    //
    // if(password.trim() == ''){
    //   Toast.show({
    //     text: 'Поле Пароль не может быть пустым!',
    //     type: 'danger',
    //   });
    //   return false;
    // }

    // let getLogin = await AsyncStorage.getItem('login_save');
    let getLogin = null;
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
    // const loginList = await AsyncStorage.getItem('login_save');
    const loginList = null;

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
