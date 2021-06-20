import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {View, StyleSheet, AsyncStorage, Picker, Platform, ScrollView, TextInput, Modal, KeyboardAvoidingView} from 'react-native';
import 'moment/locale/ru';
import CalendarStrip from 'react-native-calendar-strip';
import StarRating from "react-native-star-rating";
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    ListItem,
    Text,
    Left,
    Right,
    Body,
    FooterTab,
    Footer,
    Toast, List,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty, DATE_T, SHED_ID_T, TIME_T, TIMES_T, API, getToken } from '../constants';
import axios from 'axios';

import { Ionicons } from '@expo/vector-icons';
import {white} from "react-native-paper/lib/typescript/src/styles/colors";

class GradeForm extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            id: 0,
            listGrade: [],
            growth: '',
            weight: '',
            blood_pressure: '',
            blood_sugar: '',
            cholesterol: '',
            chss: '',
            chdd: '',
            saturation: '',
            activity_steps: '',
            activity_moderate: '',
            activity_intense: '',
            consuption_water: '',
            tobacco_sigarets: '',
            shed_id: 0,
            docid: 0,
            user: {},
            list: [],
            sortBy: 'desc',
            refreshing: false,
            modalVisible: false,
            modalReportVisible: false,
            modalValue: [],
            callPhone: '',
            ratingSet: 0,
            dataJson: '',
            doc_id: ''
        }
    }

    _getUserData = () => {
        AsyncStorage.getItem('user_data').then((value) => {
            if (value) {
                const obj = JSON.parse(value);
                this.setState({ user: obj });
            }
        });
    };

    _refreshPage = () => {
        this.setState({refreshing: true});
        this._getUserData();
        this._getList();
    }

    UNSAFE_componentWillMount() {
        this._refreshPage();
    }

    componentDidMount = async () => {
        await this.setState({shed_id: this.props.route.params.shed_id, doc_id: this.props.route.params.docid});
        this.onInfoButtonClicked(this.props.route.params.shed_id, this.props.route.params.docid);
    }

    _getUrl = async (url) => {
        const API_URL = `${API}backend/${url}`
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': this.state.token,
                },
            });

            const responseJson = await response.json();
            if (responseJson !== null) {
                if(responseJson.success == false){
                    Toast.show({
                        text: responseJson.message,
                        type: 'danger',
                        duration: 3000
                    });
                    return null;
                }
                return responseJson.result;
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }
        return null;
    }

    onInfoButtonClicked = async (shed_id, docid) => {
        console.log('onInfoButtonClicked');
        console.log(docid);
        console.log(shed_id);
        await this._getUrl('get_grade_for_visit/'+shed_id).then(value => {
            this.setState({ listGrade: value, activeDoc: docid});
            console.log(value)
            console.log('onInfoButtonClickedEnd');
        })
    }

    _getList = async () => {
        try {
            await getToken().then(itoken => {
                this.setState({ token: itoken });
            });
        } catch (error) {
            Toast.show({
                text: error,
                type: "danger"
            });
        }

        const API_URL = `${API}backend/get_shedul_data`;
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': this.state.token,
                },
            });

            const responseJson = await response.json();
            if (responseJson !== null) {
                var data = responseJson;

                if(data.success == false){
                    Toast.show({
                        text: data.message,
                        type: 'danger'
                    });
                    return;
                }

                this.setState({ list: data.result });
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }

        this.setState({refreshing: false});
    }

    _alert = async (msgToast, onSuccess = false) => {
        let tType = "success";
        if(onSuccess == false){
            tType = "danger";
        }
        Toast.show({
            text: msgToast,
            type: tType,
            duration: 3000
        });
    }

    _getDoctorList = async () => {
        await this._getUrl('get_shedul_data').then(value => {
            if(value !== null){
                this.setState({ list: value});
                this.setState({ filteredList: value});
            }
        })
    }

    _setRetviewForVisit = async () => {
        let API_URL = `${API}backend/set_grade_for_visit`;
        let showToast = false;
        let msgToast = '';
        console.log('doc_id '+this.state.doc_id);
        console.log('ratingSet '+this.state.ratingSet);
        console.log('otziv '+this.state.otziv);
        console.log('callPhone '+this.state.callPhone);
        console.log('shed_id '+this.state.shed_id);

        if(this.state.ratingSet == 0){
            showToast = true;
            msgToast = 'Поставьте пожалуйста оценку';
        }
        if(showToast)
        {
            this._alert(msgToast, false);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': this.state.token,
                },
                body: `id_doctor=${this.state.doc_id}&grade=${this.state.ratingSet}&note=${this.state.otziv}&feedback=${this.state.callPhone}&shed_id=${this.state.shed_id}`,
            });

            const responseJson = await response.json();
            console.log(responseJson);
            if (responseJson !== null) {
                let itype = 'success';

                if(responseJson.success == false){
                    itype = 'danger';
                }
                this.setState({activeDoc: null, modal: false, otziv: '', callPhone: '', ratingSet: 0, modalReportVisible: false });
                this._getDoctorList();
                this._alert(responseJson.message, responseJson.success);
                let tType = "success";
                if(responseJson.success == false){
                    tType = "danger";
                }
            }
        } catch (error) {
            this._alert("Ошибка отправки данных. Повторите еще раз");
        }
    }

    render() {
        return (
            <Container>
                <Content style={{ paddingHorizontal: 20 }}>
                    <View style={{
                    }}>
                        <ScrollView style={{ paddingTop: 40, flex: 1}}>
                            <List>
                                {this.state.listGrade.map((grade, i) => (
                                    <ListItem key={i} style={{ flexDirection: 'column', alignItems: "flex-start" }}>
                                        <View>
                                            <Text>{grade.note}</Text>
                                        </View>
                                        <View>
                                            {grade.reason != null?
                                                <Text style={{
                                                    color: 'red',
                                                    textAlign: "left"
                                                }}>Отклонен модератором. Причина:{"\n"}{grade.reason}</Text>
                                                : null }
                                        </View>
                                        <View style={{ width: '100%' }}>
                                            <Text style={{ width: '100%', textAlign: "right", fontSize: 10 }}>{grade.grade_date}</Text>
                                        </View>
                                    </ListItem>
                                ))}
                            </List>
                        </ScrollView>
                    </View>
                </Content>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior="padding"
                >
                    <View style={{ bottom: 30}}>
                        <List>
                            <ListItem noBorder>
                                <TextInput
                                    style={styles.textArea}
                                    underlineColorAndroid="transparent"
                                    placeholder="Введите отзыв"
                                    placeholderTextColor="grey"
                                    numberOfLines={2}
                                    multiline={true}
                                    onChangeText={text => this.setState({ otziv: text})}
                                />
                            </ListItem>
                            <ListItem noBorder style={{ marginTop: -20 }}>
                                <TextInput
                                    style={styles.contactInput}
                                    underlineColorAndroid="transparent"
                                    placeholder="Как с вами связаться? (Телефон или электронную почту)"
                                    placeholderTextColor="grey"
                                    onChangeText={text => this.setState({callPhone: text})}
                                />
                            </ListItem>
                            <ListItem noBorder style={{ marginTop: -20, flexDirection: 'column', }}>
                                <Text>Оцените врача по пятибалльной шкале</Text>
                                <StarRating
                                    maxStars={5}
                                    emptyStar={'ios-star-outline'}
                                    fullStar={'ios-star'}
                                    halfStar={'ios-star-half'}
                                    iconSet={'Ionicons'}
                                    rating={this.state.ratingSet}
                                    starSize={30}
                                    selectedStar={(rating) => this.setState({ratingSet: rating})}
                                    fullStarColor={'red'}
                                    emptyStarColor={'red'}
                                    interitemSpacing={20}
                                />
                            </ListItem>
                        </List>
                        <List style={{
                            marginBottom: 0,
                        }}>
                            <ListItem>
                                <Left>
                                    <Button
                                        success={true}
                                        style={{
                                            width: '90%',
                                            borderRadius: 10,
                                            backgroundColor: '#5cb85c',}}
                                        onPress={() => this.props.navigation.goBack()}
                                    >
                                        <Text style={{ width: '100%', textAlign: "center", color: 'white'}}>Закрыть</Text>
                                    </Button>
                                </Left>
                                <Body>
                                    <Button
                                        style={{
                                            width: '90%',
                                            borderRadius: 10,
                                            backgroundColor: '#007aff',}}
                                        onPress={() => {
                                            this._setRetviewForVisit()
                                        }}
                                    >
                                        <Text style={{ width: '100%', textAlign: "center", color: 'white'}}>Отправить</Text>
                                    </Button>
                                </Body>
                            </ListItem>
                        </List>
                    </View>
                </KeyboardAvoidingView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTop: {
        backgroundColor: '#01A19F',
    },
    cancelButton: {
        color: 'red',
        fontSize: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    modalView: {
        margin: 10,
    },
    contactInput: {
        borderWidth: 1,
        width: '100%',
        padding: 5,
    },
    textArea: {
        height: 65,
        width: '100%',
        padding: 5,
        textAlignVertical: "top",
        justifyContent: "flex-start",
        borderWidth: 1
    },
});

export default GradeForm;
