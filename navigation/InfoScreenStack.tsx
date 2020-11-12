import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import InfoDetails from '../screens/Info/InfoDetails';
import InfoScreen from '../screens/Info/InfoScreen';

const Stack = createStackNavigator();
export const InfoScreenStack = () => {
  return (
    <Stack.Navigator initialRouteName={'InfoScreen'} headerMode="none">
      <Stack.Screen name={'InfoScreen'} component={InfoScreen} />
      <Stack.Screen name={'InfoDetails'} component={InfoDetails} />
    </Stack.Navigator>
  );
};
