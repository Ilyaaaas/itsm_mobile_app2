import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Left,
    Right,
    Body,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

function About({ navigation, route }) {
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
            <View style={styles.container}>
                <View style={styles.background}>
                    <ImageBackground
                        style={styles.image}
                        imageStyle={{
                            borderBottomLeftRadius: 40,
                            borderBottomRightRadius: 40,
                            borderTopWidth: 20,
                        }}
                        source={{
                            uri: 'https://smart24.kz/video/sci-fi.jpg',
                        }}
                        blurRadius={4}
                    >
                        <View style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            backgroundColor: '#1a192a',
                            opacity: 0.6,
                            borderBottomLeftRadius: 40,
                            borderBottomRightRadius: 40,
                        }}/>
                        <Text style={{
                            color: '#d7d8f3',
                            zIndex: 10,
                            fontSize: 40,
                            marginTop: 35,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            alignSelf: 'center',
                            fontWeight: 'bold',
                        }}>
                            SMART24
                        </Text>
                        <Text style={{
                            color: '#b4b5cb',
                            zIndex: 10,
                            fontSize: 14,
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            alignSelf: 'center',
                            marginLeft: 30,
                            marginRight: 30,
                            marginTop: 10,
                            textAlign: 'center',
                        }}>
                            Автоматизированная информационная система по управлению бизнес-услугами ТОО «QazCloud»
                        </Text>
                    </ImageBackground>
                </View>
            </View>
            <Content style={{backgroundColor: '#ebebeb'}}>
                <View>
                    <Text style={{
                        fontSize: 14,
                        paddingVertical: 5,
                        padding: 30,
                        textAlign: 'center',
                        color: '#1a192a',
                    }}>
                        ITSM (IT Service Management, управление ИТ-услугами) — подход к управлению и организации ИТ-услуг, направленный на удовлетворение потребностей бизнеса. Управление ИТ-услугами реализуется поставщиками ИТ-услуг путём использования оптимального сочетания людей, процессов и информационных технологий[1]. Для содействия реализации подхода к управлению ИТ-услугами используется серия документов ITIL.

                        В отличие от более традиционного технологического подхода, ITSM рекомендует сосредоточиться на клиенте и его потребностях, на услугах, предоставляемых пользователю информационными технологиями, а не на самих технологиях. При этом процессная организация предоставления услуг и наличие заранее оговоренных в соглашениях об уровне услуг параметров эффективности (KPI) позволяет ИТ-отделам предоставлять качественные услуги, измерять и улучшать их качество.

                        Важным моментом при изложении принципов ITSM является системность. При изложении каждого составного элемента ITSM (управление инцидентами, управление конфигурациями, управление безопасностью и т. д.) в обязательном порядке прослеживается его взаимосвязь и координация с остальными элементами (службами, процессами) и при этом даются необходимые практические рекомендации.

                        ITIL не является конкретным алгоритмом или руководством к действию, но она описывает передовой опыт (best practices) и предлагает рекомендации по организации процессного подхода и управления качеством предоставления услуг.[2] Это позволяет оторваться от особенностей данного конкретного предприятия в данной конкретной отрасли. Вместе с тем, несмотря на определённую абстрактность, ITIL всячески нацелено на практическое использование. В каждом разделе библиотеки приводятся ключевые факторы успеха внедрения того или иного процесса, практические рекомендации при этом превалируют над чисто теоретическими рассуждениями.
                    </Text>
                </View>
            </Content>
        </Container>
    )
};

const styles = StyleSheet.create({
    headerTop: {
        backgroundColor: '#1a192a',
        borderBottomWidth: 2,
        borderBottomColor: '#1a192a',
    },
    container: {
        alignSelf: 'center',
        width: '100%',
        overflow: 'hidden',
        height: 160,
    },
    background: {
        width: '100%',
        height: 400,
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#ebebeb',
    },
    image: {
        height: 160,
        width: '100%',
        position: 'absolute',
        bottom: 0,
    }
});

export default About
