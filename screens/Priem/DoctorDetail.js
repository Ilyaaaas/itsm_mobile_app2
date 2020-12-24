import React, { useState, useEffect } from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    List,
    ListItem,
    Text,
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
import { connect } from 'react-redux';


import { API } from '../constants';

function DoctorDetail({ navigation, route }) {
    const [docData, setDocData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let docId = route.params.docId

        let API_URL = `${API}backend/get_doctor_data?id=${docId}`
        axios.get(API_URL).then(res => {
            if (res.data.success) {
                setDocData(res.data.result[0]),
                    setIsLoading(false);
            }
        }).catch(err => console.log('Doctor data getting error: ', err))
    }, [])

    return (
        <Container>
            <Header style={styles.headerTop}>
                <Left style={{ flex: 1 }}>
                    <Ionicons
                        name="md-arrow-back"
                        style={{ color: '#046475', marginLeft: 10 }}
                        onPress={() => navigation.goBack()}
                        size={24}
                    />
                </Left>
                <Body style={{ flex: 3 }}>
                    <Title style={{ color: '#046475', fontSize: 20 }}>
                        О враче
                    </Title>
                </Body>
                <Right />
            </Header>

            <Content style={{ marginHorizontal: 20, marginTop: 10 }}>
                {
                    isLoading ?
                        <Text style={{ textAlign: "center", fontSize: 14, flex: 1, marginTop: 20, width: '100%' }}>Подождите идет загрузка данных</Text> :
                        <>
                            <Text style={styles.textStyle}>Врач: {docData.fio}</Text>
                            <Text style={styles.textStyle}>Специальность: {docData.spr_value}</Text>
                            <Text style={styles.textStyle}>Категория: {docData.category_name || '***********'}</Text>
                            {docData.science_degree && <Text style={styles.textStyle}>Ученая степень: {docData.science_degree}</Text>}
                        </>
                }

            </Content>
        </Container>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerTop: {
        backgroundColor: '#01A19F',
    },
    textStyle: {
        paddingVertical: 5
    }
});

export default DoctorDetail