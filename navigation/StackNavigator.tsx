import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import { LoginScreen } from '../screens/Login/LoginScreen';
import { RegistrationScreen } from '../screens/Registration/RegistrationScreen';
import { RestorePassword } from '../screens/RestorePassword/RestorePassword';
import { DrawerNavigator } from './DrawerNavigator';

const Stack = createStackNavigator();
export const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" headerMode="none">
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RestorePassword" component={RestorePassword} />
        <Stack.Screen name="Home" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
