import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import DoctorList from '../screens/Doctors/DoctorList';

const Stack = createStackNavigator();
export const DoctorListStack = () => {
  return (
    <Stack.Navigator initialRouteName={'InfoScreen'} headerMode="none">
      <Stack.Screen name={'DoctorList'} component={DoctorList} />
    </Stack.Navigator>
  );
};
