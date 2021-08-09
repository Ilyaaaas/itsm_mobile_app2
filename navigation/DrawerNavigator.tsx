import {FontAwesome, Entypo, FontAwesome5, MaterialIcons} from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import {AppState, View, Text} from "react-native";
import {useEffect, useRef, useState} from "react";
import {StackActions} from "@react-navigation/native";
import {Toast} from "native-base";

import {getToken, provToken} from '../screens/constants';

import ContactsScreen from '../screens/ContactsScreen';
import HomeScreen from '../screens/HomeScreen';
import { CustomDrawerContent } from './CustomDrawerContent';
import { AboutStack } from './AboutStack';
import Notifications from '../screens/Notifications'

const Drawer = createDrawerNavigator();

export const DrawerNavigator = (props) => {

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        if (
            appState.current.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            //console.log("App has come to the foreground!");
            provToken().then(istate => {
                if(istate === false){
                    Toast.show({
                        text: 'Вы были не активны 10 мин. Пожалуйста авторизуйтесь!',
                        type: 'danger',
                        duration: 4000,
                    });
                    props.navigation.dispatch(StackActions.replace('Login'));
                }
            });
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        //console.log("AppState", appState.current);
        if(appState.current === 'background'){
            getToken();
        }
        //console.log('State = '+appState.current);
    };

  return (
      <Drawer.Navigator initialRouteName={'Home'} drawerContent={CustomDrawerContent}>
      <Drawer.Screen name="Home" component={HomeScreen} options={{
          drawerLabel: 'Заявки',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
          name="Notifications"
          component={Notifications}
          options={{
              drawerLabel: 'Уведомления',
              drawerIcon: ({ color, size }) => (
                  <MaterialIcons name="notifications-active" size={size} color={color} />
              )
          }}
      />

      <Drawer.Screen
        name="AboutStack"
        component={AboutStack}
        options={{
          drawerLabel: 'О системе',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="info-circle" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="ContactsScreen"
        component={ContactsScreen}
        options={{
          drawerLabel: 'Контакты',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="phone" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

