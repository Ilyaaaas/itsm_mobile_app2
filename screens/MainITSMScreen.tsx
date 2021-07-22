import React from 'react';
import {
    Text,
    Button,
    View
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiaryScreenView from "./Diary/DiaryScreenView";
import DiaryScreen from "./Diary/DiaryScreen";
import HomeScreen from "./HomeScreen";
import About from "./About/About";
import InfoScreen from "./Info/InfoScreen";
import Notifications from "./Notifications";
import OfferScreen from "../screens/Offer/OfferScreen";
import {Root} from "native-base";
import {Ionicons, Feather, AntDesign} from '@expo/vector-icons';
import {BaseButton} from "react-native-gesture-handler";

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
                    <BottomTab.Screen name="Уведомления" component={Notifications}
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons name="md-notifications-outline" size={30} color={color}/>,
                        }}
                    />
                    <BottomTab.Screen name=" " component={OfferScreen}
                                      options={{
                                          tabBarIcon: ({ color }) => <AntDesign
                                              name="pluscircle"
                                              size={30}
                                              color="#313B73"
                                              onPress={() => this.props.navigation.navigate('OfferScreen')}
                                          />,
                                      }}
                    />
                    <BottomTab.Screen name="Профиль" component={DiaryScreen}
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


