import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { LoginScreen } from '../screens/Login/LoginScreen';
import { RegistrationScreen } from '../screens/Registration/RegistrationScreen';
import { RestorePassword } from '../screens/RestorePassword/RestorePassword';
import { DrawerNavigator } from './DrawerNavigator';
import { DiaryStack } from './DiaryStack';
import { OfferStack } from './OfferStack';
import OfferScreen from '../screens/Offer/OfferScreen';
import DoctorList from "../screens/Doctors/DoctorList";

const Stack = createStackNavigator();
export const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" headerMode="none">
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RestorePassword" component={RestorePassword} />
        <Stack.Screen name="Home" component={DrawerNavigator} />
        <Stack.Screen name="DiaryStack" component={DiaryStack} />
        <Stack.Screen name="OfferStack" component={OfferStack} />
        <Stack.Screen name="RequestList" component={DoctorList} />
        <Stack.Screen name="OfferScreen" component={OfferScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

