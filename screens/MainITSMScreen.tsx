import React from 'react';
import {
    Text
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiaryScreenView from "./Diary/DiaryScreenView";
import HomeScreen from "./HomeScreen";
import About from "./About/About";
import InfoScreen from "./Info/InfoScreen";
import {Root} from "native-base";
import { Ionicons, Feather } from '@expo/vector-icons';

const BottomTab = createBottomTabNavigator();

class MainITSMScreen extends React.Component{
    render() {
        return (
            <Root>
                <BottomTab.Navigator>
                    <BottomTab.Screen name="Заявки" component={HomeScreen}
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons name="ios-chatbubbles" size={30} color={color}/>,
                        }}
                    />
                    <BottomTab.Screen name="Уведомления" component={DiaryScreenView}
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons name="md-notifications-outline" size={30} color={color}/>,
                        }}
                    />
                    <BottomTab.Screen name="Профиль" component={About}
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons size={30} name="ios-person" color={color}/>,
                        }}
                    />
                    <BottomTab.Screen name="Еще" component={InfoScreen}
                        options={{
                            tabBarIcon: ({ color }) => <Feather name="more-vertical" size={24}  color={color} />,
                        }}
                    />
                </BottomTab.Navigator>
            </Root>
        )
    }
}

function TabBarIcon(props: { name: string; color: string }) {
    return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default MainITSMScreen;


