import React, { useState, useEffect } from 'react';
import { StyleSheet, AsyncStorage, View, Text, TouchableOpacity, Dimensions } from 'react-native';
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
                        style={{ color: '#046475', marginLeft: 10 }}
                        onPress={() => navigation.openDrawer()}
                        size={24}
                    />
                </Left>
                <Body style={{ flex: 3 }}>
                    <Title style={{ color: '#046475', fontSize: 20 }}>
                        О больнице
                    </Title>
                </Body>
                <Right />
            </Header>

            <Content>
                <WebView
                    source={{ uri: `${API}backend/about` }}
                    style={{ width: ScreenWidth-10, height: ScreenHeight-100, marginLeft: 5 }}
                />
            </Content>
        </Container>
    )
};

const styles = StyleSheet.create({
    headerTop: {
        backgroundColor: '#01A19F',
    },
});

export default About