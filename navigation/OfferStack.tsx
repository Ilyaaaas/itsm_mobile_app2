import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import DiaryScreen from "../screens/Diary/DiaryScreen";
import DiaryScreenView from "../screens/Diary/DiaryScreenView";
import DiaryScreenResult from '../screens/Diary/DiaryScreenResult';
import HomeScreen from '../screens/HomeScreen';
import OfferScreen from '../screens/Offer/OfferScreen';

const Stack = createStackNavigator();

export const OfferStack = () => {
    return (
        <Stack.Navigator initialRouteName="HomeScreen" headerMode="none">
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="DiaryScreenView" component={DiaryScreenView} />
            <Stack.Screen name="OfferScreen" component={OfferScreen} />
        </Stack.Navigator>
    );
};

