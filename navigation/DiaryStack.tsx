import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import DiaryScreen from "../screens/Diary/DiaryScreen";
import DiaryScreenView from "../screens/Diary/DiaryScreenView";
import DiaryScreenResult from '../screens/Diary/DiaryScreenResult';

const Stack = createStackNavigator();

export const DiaryStack = () => {
    return (
        <Stack.Navigator initialRouteName="DiaryScreen" headerMode="none">
            <Stack.Screen name="DiaryScreen" component={DiaryScreen} />
            <Stack.Screen name="DiaryScreenView" component={DiaryScreenView} />
            <Stack.Screen name="DiaryScreenResult" component={DiaryScreenResult} />
        </Stack.Navigator>
    );
};
