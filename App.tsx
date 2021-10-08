import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Root, Text } from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {screensEnabled, ScreenContainer} from 'react-native-screens';
import { Provider } from 'react-redux';
import { StackNavigator } from './navigation/StackNavigator';

import './helpers/axios-defaults';
import { store } from './redux';
import * as Permissions from 'expo-permissions';

screensEnabled();

export default () => {
    const [isReady, setIsReady] = useState<boolean>(false);

    const askPermissions = async () => {
        const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            return false;
        }
        return true;
    }

    useEffect(() => {
        askPermissions();

        Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            ...Ionicons.font,
        }).then(() => {
            setIsReady(true);
        });
    }, []);

    if (!isReady) {
        return <AppLoading />;
    }

    return (
        <Provider store={store}>
            <Root>
                <StackNavigator />
            </Root>
        </Provider>
    );
};
