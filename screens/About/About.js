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

    // useEffect(() => {
    //     (async () => {
    //         getToken().then(token => {
    //             if(token == null){
    //                 navigation.dispatch(StackActions.replace('Login'));
    //             }
    //             let API_URL = `${API}backend/about`
    //             axios.get(API_URL, {
    //                 headers: {
    //                     Accept: 'application/json',
    //                     'Content-Type': 'application/x-www-form-urlencoded',
    //                     'token': token,
    //                 }
    //             }).then(res => {
    //                 setData(res.data)
    //             }).catch(err => console.log('About data getting error: ', err))
    //         });
    //     }
    //     )();
    //
    // }, [])

    return (
        <Container>
            <Header style={styles.headerTop}>
                <Left style={{ flex: 1 }}>
                    <Ionicons
                        name="md-arrow-back"
                        style={{ color: '#a2a3b7', marginLeft: 10 }}
                        onPress={() => navigation.goBack()}
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
                <Text style={{ fontSize: 12, paddingVertical: 5, padding: 10, justifyContent: 'center', alignItems: "center",
                    textAlign: 'justify',
                }}>
                    ITSM (IT Service Management, управление ИТ-услугами) — подход к управлению и организации ИТ-услуг, направленный на удовлетворение потребностей бизнеса. Управление ИТ-услугами реализуется поставщиками ИТ-услуг путём использования оптимального сочетания людей, процессов и информационных технологий[1]. Для содействия реализации подхода к управлению ИТ-услугами используется серия документов ITIL.

                    В отличие от более традиционного технологического подхода, ITSM рекомендует сосредоточиться на клиенте и его потребностях, на услугах, предоставляемых пользователю информационными технологиями, а не на самих технологиях. При этом процессная организация предоставления услуг и наличие заранее оговоренных в соглашениях об уровне услуг параметров эффективности (KPI) позволяет ИТ-отделам предоставлять качественные услуги, измерять и улучшать их качество.

                    Важным моментом при изложении принципов ITSM является системность. При изложении каждого составного элемента ITSM (управление инцидентами, управление конфигурациями, управление безопасностью и т. д.) в обязательном порядке прослеживается его взаимосвязь и координация с остальными элементами (службами, процессами) и при этом даются необходимые практические рекомендации.

                    ITIL не является конкретным алгоритмом или руководством к действию, но она описывает передовой опыт (best practices) и предлагает рекомендации по организации процессного подхода и управления качеством предоставления услуг.[2] Это позволяет оторваться от особенностей данного конкретного предприятия в данной конкретной отрасли. Вместе с тем, несмотря на определённую абстрактность, ITIL всячески нацелено на практическое использование. В каждом разделе библиотеки приводятся ключевые факторы успеха внедрения того или иного процесса, практические рекомендации при этом превалируют над чисто теоретическими рассуждениями.
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
