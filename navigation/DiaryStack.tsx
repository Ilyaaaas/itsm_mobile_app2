import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import DiaryScreen from "../screens/Diary/DiaryScreen";

const Stack = createStackNavigator();

export const DiaryStack = () => {
    return (
        <Stack.Navigator initialRouteName="DiaryScreen" headerMode="none">
            <Stack.Screen name="DiaryScreen" component={DiaryScreen} />
        </Stack.Navigator>
    );
};

