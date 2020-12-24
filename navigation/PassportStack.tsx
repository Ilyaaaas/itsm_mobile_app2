import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import PassportMain from '../screens/Passport/PassportMain';
import PassportExtracts from '../screens/Passport/PassportExtracts';
import SpravkiExtracts from "../screens/Passport/SpravkiExtracts";

const Stack = createStackNavigator();

export const PassportStack = () => {
    return (
        <Stack.Navigator initialRouteName="PassportMain" headerMode="none">
            <Stack.Screen name="PassportMain" component={PassportMain} />
            <Stack.Screen name="PassportExtracts" component={PassportExtracts} />
            <Stack.Screen name="SpravkiExtracts" component={SpravkiExtracts} />
        </Stack.Navigator>
    );
};