import {FontAwesome, Entypo, FontAwesome5, MaterialIcons} from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import {AppState, View, Text} from "react-native";
import {useEffect, useRef, useState} from "react";
import {StackActions} from "@react-navigation/native";
import {Toast} from "native-base";

import {getToken, provToken} from '../screens/constants';

import ContactsScreen from '../screens/ContactsScreen';
import { HealthyLifestyleScreen } from '../screens/HealthyLifestyle/HealthyLifestyleScreen';
import HomeScreen from '../screens/HomeScreen';
import { CustomDrawerContent } from './CustomDrawerContent';
import { InfoScreenStack } from './InfoScreenStack';
import { PriemStack } from './PriemStack';
import { ResultsStack } from './ResultsStack';
import { DoctorListStack } from './DoctorListStack';
import { AboutStack } from './AboutStack';
import { DiaryStack } from './DiaryStack';
import { PassportStack } from './PassportStack';
import ReceptsList from '../screens/Recepts/ReceptsList';
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
      {/*<Drawer.Screen*/}
      {/*  name="DoctorListStack"*/}
      {/*  component={DoctorListStack}*/}
      {/*  options={{*/}
      {/*    drawerLabel: 'Наши врачи',*/}
      {/*    drawerIcon: ({ color, size }) => (*/}
      {/*      <FontAwesome name="user-md" color={color} size={size} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Drawer.Screen*/}
      {/*  name="PriemStack"*/}
      {/*  component={PriemStack}*/}
      {/*  options={{*/}
      {/*    drawerLabel: 'Мои записи',*/}
      {/*    drawerIcon: ({ color, size }) => (*/}
      {/*      <FontAwesome name="calendar" color={color} size={size} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Drawer.Screen*/}
      {/*  name="ResultsStack"*/}
      {/*  component={ResultsStack}*/}
      {/*  options={{*/}
      {/*    drawerLabel: 'Мои анализы',*/}
      {/*    drawerIcon: ({ color, size }) => (*/}
      {/*      <FontAwesome name="medkit" color={color} size={size} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Drawer.Screen*/}
      {/*    name="DiaryStack"*/}
      {/*    component={DiaryStack}*/}
      {/*    options={{*/}
      {/*        drawerLabel: 'Дневник пациента',*/}
      {/*        drawerIcon: ({ color, size }) => (<Entypo name="open-book" color={color} size={size} />),*/}
      {/*    }}*/}
      {/*/>*/}

      {/*<Drawer.Screen*/}
      {/*    name="PassportStack"*/}
      {/*    component={PassportStack}*/}
      {/*    options={{*/}
      {/*        drawerLabel: 'E-паспорт здоровья',*/}
      {/*        drawerIcon: ({ color, size }) => (<FontAwesome5 name="passport" color={color} size={size} />),*/}
      {/*    }}*/}
      {/*/>*/}

      {/*<Drawer.Screen*/}
      {/*  name="InfoScreenStack"*/}
      {/*  component={InfoScreenStack}*/}
      {/*  options={{*/}
      {/*    drawerLabel: 'Рекомендации',*/}
      {/*    drawerIcon: ({ color, size }) => (*/}
      {/*      <FontAwesome name="list-alt" color={color} size={size} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Drawer.Screen*/}
      {/*  name="HealthyLifestyle"*/}
      {/*  component={HealthyLifestyleScreen}*/}
      {/*  options={{*/}
      {/*    drawerLabel: 'Здоровый образ жизни',*/}
      {/*    drawerIcon: ({ color, size }) => (*/}
      {/*      <FontAwesome name="heart" color={color} size={size} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Drawer.Screen*/}
      {/*    name="ReceptsList"*/}
      {/*    component={ReceptsList}*/}
      {/*    options={{*/}
      {/*        drawerLabel: 'Рецепты',*/}
      {/*        drawerIcon: ({ color, size }) => (*/}
      {/*            <FontAwesome5 name="notes-medical" color={color} size={size} />*/}
      {/*        ),*/}
      {/*    }}*/}
      {/*/>*/}

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
