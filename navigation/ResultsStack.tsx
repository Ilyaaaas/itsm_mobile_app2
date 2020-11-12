import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import ResultsScreen from '../screens/Analise/ResultsScreen';
import ResultsShow from '../screens/Analise/ResultsShow';

const Stack = createStackNavigator();

export const ResultsStack = () => {
  return (
    <Stack.Navigator initialRouteName={'Results'} headerMode="none">
      <Stack.Screen name={'Results'} component={ResultsScreen} />
      <Stack.Screen name={'ResultsShow'} component={ResultsShow} />
    </Stack.Navigator>
  );
};
