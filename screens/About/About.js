import React, { useState, useEffect } from 'react';
import {StyleSheet, AsyncStorage, View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    List,
    ListItem,
    Thumbnail,
    Left,
    Right,
    Body,
    FooterTab,
    Footer,
    Spinner,
    Toast,
} from 'native-base';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';


let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;


import { API, getToken } from '../constants';
import {StackActions} from "@react-navigation/native";

function About({ navigation, route }) {

    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => {
                getToken().then(token => {
                    if(token == null){
                        navigation.dispatch(StackActions.replace('Login'));
                    }
                    let API_URL = `${API}backend/about`
                    axios.get(API_URL, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'token': token,
                        }
                    }).then(res => {
                        setData(res.data)
                    }).catch(err => console.log('About data getting error: ', err))
                });
            }
        )();

    }, [])

    return (
        <Container>
            <Header style={styles.headerTop}>
                <Left style={{ flex: 1 }}>
                    <Ionicons
                        name="ios-menu"
                        style={{ color: '#a2a3b7', marginLeft: 10 }}
                        onPress={() => navigation.openDrawer()}
                        size={24}
                    />
                </Left>
                <Body style={{ flex: 3 }}>
                    <Title style={{ color: '#a2a3b7', fontSize: 20 }}>
                        О системе
                    </Title>
                </Body>
                <Right />
            </Header>

            <Content>
                <Image source={'../../assets/splash.png'}
                       style = {{ width: '100%', height: '100%' }}
                />
                <Text style={styles.text}>
                    Version 1.0.0
                </Text>
            </Content>
        </Container>

    )
};

const styles = StyleSheet.create({
    headerTop: {
        backgroundColor: '#1a192a',
    },
});

export default About
