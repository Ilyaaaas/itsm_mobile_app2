import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import About from '../screens/About/About';

const Stack = createStackNavigator();
export const AboutStack = () => {
  return (
    <Stack.Navigator initialRouteName={'InfoScreen'} headerMode="none">
      <Stack.Screen name={'About'} component={About} />
    </Stack.Navigator>
  );
};
