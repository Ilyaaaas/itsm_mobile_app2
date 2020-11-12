import React, { useState, useEffect } from 'react';
import { StyleSheet, AsyncStorage, View, Text, TouchableOpacity } from 'react-native';
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

import StarRating from 'react-native-star-rating';


import { API } from '../constants';

function DoctorList({ navigation, route }) {

    const [docList, setDocList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDocInfoSelected, setIsDocInfoSelected] = useState(null);
    const [isDocReviewSelected, setIsDocReviewSelected] = useState(null);
    const [docInfo, setDocInfo] = useState(null);

    useEffect(() => {
        (async () => {
            const token = await AsyncStorage.getItem('token');

            let API_URL = `${API}backend/get_doctors`
            axios.get(API_URL, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': token,
                }
            }).then(res => {
                if (res.data.success) {
                    setDocList(res.data.result),
                        setIsLoading(false);
                }
            }).catch(err => console.log('Doctors List getting error: ', err))
        }
        )();

    }, [])

    const getDoctorInfo = (docId) => {
        let API_URL = `${API}backend/get_doctor_data?id=${docId}`
        axios.get(API_URL).then(res => {
            if (res.data.success) {
                setDocInfo(res.data.result[0]),
                    setIsLoading(false);
            }
        }).catch(err => console.log('Doctor data getting error: ', err))
    }

    const onReviewButtonClicked = (index) => {
        setDocInfo(null)
        if (isDocReviewSelected === index) {
            setIsDocReviewSelected(null)
        } else {
            setIsDocReviewSelected(index)
        }
    }

    const onInfoButtonClicked = (index, docId) => {
        setDocInfo(null)
        if (isDocInfoSelected === index) {
            setIsDocInfoSelected(null)
        } else {
            getDoctorInfo(docId)
            setIsDocInfoSelected(index)
        }
    }


    const onSetGradeButtonPressed = () => {
        let API_URL = `${API}backend/set_grade`
        axios.post(API_URL, null, {
            params: {
                id_doctor: '',
                grade: 3,
                note: '',
                feedback: ''
            }
        }).then(res => {
            if (res.data.success) {
                setDocInfo(res.data.result[0]),
                    setIsLoading(false);
            }
        }).catch(err => console.log('Doctor data getting error: ', err))
    }


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
                        Наши врачи
                    </Title>
                </Body>
                <Right />
            </Header>

            <Content style={{ paddingTop: 10 }}>
                {
                    docList && docList.map((doc, i) => {
                        return (
                            <ListItem key={i} style={{ paddingBottom: 5, paddingTop: 5 }}>
                                <Body>
                                    <Text style={styles.textName}>{doc.fname + " " + doc.sname + " " + doc.lname}</Text>
                                    <View style={styles.starContainer}>
                                        <StarRating
                                            disabled={true}
                                            maxStars={5}
                                            rating={parseInt(doc.avg_grade)}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            starSize={15}
                                            selectedStar={(rating) => console.log(rating)}
                                            fullStarColor={'red'}
                                            emptyStarColor={'red'}
                                        />
                                        <Text style={styles.ratingText}>{doc.avg_grade}</Text>
                                    </View>
                                    <View style={styles.buttonsContainer}>
                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.button, { backgroundColor: isDocInfoSelected === i ? '#fff' : '#01A19F', borderWidth: isDocInfoSelected === i ? 1 : 0, paddingVertical: isDocInfoSelected === i ? 3 : 5, paddingHorizontal: isDocInfoSelected === i ? 8 : 10 }]}
                                            onPress={() => onInfoButtonClicked(i, doc.doc_id)}
                                        >
                                            <Text style={{ color: isDocInfoSelected === i ? '#01A19F' : '#fff' }}>О враче</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            activeOpacity={0.7}
                                            style={[styles.button, { backgroundColor: isDocReviewSelected === i ? '#fff' : '#01A19F', borderWidth: isDocReviewSelected === i ? 1 : 0, paddingVertical: isDocReviewSelected === i ? 3 : 5, paddingHorizontal: isDocReviewSelected === i ? 8 : 10 }]}
                                            onPress={() => onReviewButtonClicked(i)}
                                        >
                                            <Text style={{ color: isDocReviewSelected === i ? '#01A19F' : '#fff' }}>Отзывы</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {docInfo && !isLoading && isDocInfoSelected === i && <View>
                                        <Text style={styles.textStyle}>Категория: {docInfo.category_name || '***********'}</Text>
                                        {docInfo.science_degree && <Text style={styles.textStyle}>Ученая степень: {docInfo.science_degree}</Text>}
                                    </View>}

                                    {
                                        isDocReviewSelected === i &&
                                        <View>

                                        </View>
                                    }
                                </Body>
                                <Right>
                                    <Text numberOfLines={1} style={styles.textSpecialty}>{doc.spr_value}</Text>
                                </Right>
                            </ListItem>
                        )
                    })
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
    textName: {
        fontSize: 14,
        color: '#046475',
        fontWeight: '700'
    },
    textSpecialty: {
        fontSize: 10,
        color: '#046475',
        fontWeight: '300'
    },
    starContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    ratingText: {
        color: 'red',
        fontSize: 12,
        fontWeight: '300',
        marginLeft: 10
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        borderRadius: 10,
        margin: 3,
        borderColor: '#01A19F'
    },
    textStyle: {
        paddingVertical: 5
    }
});

export default DoctorList