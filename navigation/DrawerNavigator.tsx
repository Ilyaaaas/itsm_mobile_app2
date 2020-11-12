import { FontAwesome } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';

import ContactsScreen from '../screens/ContactsScreen';
import { HealthyLifestyleScreen } from '../screens/HealthyLifestyle/HealthyLifestyleScreen';
import HomeScreen from '../screens/HomeScreen';
import { CustomDrawerContent } from './CustomDrawerContent';
import { InfoScreenStack } from './InfoScreenStack';
import { PriemStack } from './PriemStack';
import { ResultsStack } from './ResultsStack';
import { DoctorListStack } from './DoctorListStack';
import { AboutStack } from './AboutStack';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName={'Home'}
      drawerContent={CustomDrawerContent}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: 'Главная',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="DoctorListStack"
        component={DoctorListStack}
        options={{
          drawerLabel: 'Наши врачи',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="user-md" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="PriemStack"
        component={PriemStack}
        options={{
          drawerLabel: 'Мои записи',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="ResultsStack"
        component={ResultsStack}
        options={{
          drawerLabel: 'Мои анализы',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="medkit" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="InfoScreenStack"
        component={InfoScreenStack}
        options={{
          drawerLabel: 'Рекомендации',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="list-alt" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="HealthyLifestyle"
        component={HealthyLifestyleScreen}
        options={{
          drawerLabel: 'Здоровый образ жизни',
          drawerIcon: ({ color, size }) => (
            <FontAwesome name="heart" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="AboutStack"
        component={AboutStack}
        options={{
          drawerLabel: 'О больнице',
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
