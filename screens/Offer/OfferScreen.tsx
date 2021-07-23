import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {View, StyleSheet, AsyncStorage, Picker, Platform, TextInput} from 'react-native';
import 'moment/locale/ru';
import CalendarStrip from 'react-native-calendar-strip';
import {AntDesign, Ionicons, FontAwesome} from '@expo/vector-icons';
import HomeScreen from '../HomeScreen';
import axios from 'axios';
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
    Toast, List, Tabs, Input, Icon,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Notifications from "expo-notifications";
import DiaryScreenView from "../Diary/DiaryScreenView";

import { resetFormInfo, setFormInfo } from '../../actions/form-actions';
import { isEmpty, DATE_T, SHED_ID_T, TIME_T, TIMES_T, API, getToken } from '../constants';
import {WebView} from "react-native-webview";
import {Modal} from "react-native-paper";
import {StackActions} from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as DocumentPicker from 'expo-document-picker';

const BottomTab = createBottomTabNavigator();
const CHOOSE_SPEC = 'choose-spec',
    CHOOSE_DOCTOR = 'choose-doctor';

const datesWhitelistEmpty = [];

const datesBlacklistEmpty = [],
    datesBlacklist = []; // 1 day disabled

const locale = {
    name: 'ru',
    config: {
        months: 'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split(
            '_'
        ),
        monthsParseExact: true,
        weekdays: 'Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота'.split(
            '_'
        ),
        weekdaysShort: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
        weekdaysMin: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
        weekdaysParseExact: true,
        meridiem(hours, minutes, isLower) {
            return hours < 12 ? 'PD' : 'MD';
        },
        week: {
            dow: 0,
        },
    },
};

function Test() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Test</Text>
        </View>
    );
}

function Test2() {
    return (
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Test2</Text>
        </View>
    );
}

function Test3() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Test3</Text>
        </View>
    );
}

export default function OfferScreen({ navigation }) {
    const [datesWhitelist, setDatesWhitelist] = useState([
        {
            start: moment(),
            end: moment().add(20, 'days'),
        },
    ]);

    const [customDatesStyles, setDatesStyles] = useState([]);
    const [sendedFileId, setSendedFileId] = useState([]);

    const [openCheck, setOpenCheck] = useState(false);
    const [firstClick, setfirstClick] = useState(true);
    const [typeUrl, setTypeURL] = useState(0);
    const [vidPriem, setVidPriem] = useState('');
    const [offerDescr, setOfferDescr] = useState('');
    const [disType, setDisType] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [services, setServices] = useState();
    const [catalogs, setCatalogs] = useState();
    const [deadLine, setOfferTitle] = useState();
    const [file, setFile] = useState();
    const [selectedService, setSelectedService] = useState();
    const [selectedCatalog, setSelectedCatalog] = useState();
    const [token, setToken] = useState('qyYVrigGJkT0d-9kmZDq_uAk2iBaR17v');
    const form = useSelector((state) => state.form);
    const { date = [], time = '', times = [], shedId = '' } = form;
    const dispatch = useDispatch();

    useEffect(() => {
        getServices();
        getCatalogs();
    }, []);

    const createOffer = async () =>
    {
        if(selectedService == '')
        {
            alert('Выберите категорию');
            return
        }
        if(offerDescr == '')
        {
            alert('Заполните описание заявки');
            return
        }

        fetch('http://api.smart24.kz/service-requests/v1/request',
            {
                method:'POST',
                headers: {"x-api-key": token,
                    'Accept':       'application/json',
                    'Content-Type': 'application/json',
                    },
                body: '{"product_id": "'+selectedService+'", "descr": "'+offerDescr+'"}'}
        )
            .then(response => response.text())
            .then(function(data){
                // console.log(data);
            })
            .catch(error => console.error(error))
            .then()
            .finally()
            alert('Заявка успешно отправлена!');
            navigation.goBack();
    }

    const getCatalogs = async () =>
    {
        fetch('http://api.smart24.kz/service-catalog/v1/catalog?access-token='+token+'&_format=json',
            {method:'GET',
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"},
                }
        )
            .then(response => response.json())
            .then(function(data){
                setCatalogs(data.items);
            })
            .catch(error => console.error(error))
            .then()
            .finally()
    }

    const getServices = async () =>
    {
        fetch('http://api.smart24.kz/service-catalog/v1/product?access-token='+token+'&_format=json',
            {method:'GET',
                headers: {
                    "Content-type": "application/json",
                    "Accept": "application/json"},
            }
        )
            .then(response => response.json())
            .then(function(data){
                setServices(data.items);
            })
            .catch(error => console.error(error))
            .then()
            .finally()
    }

    function _renderServices()
    {
        if(services != undefined)
        {
            return
            <Picker
                // style={{your_style}}
                mode="dropdown"
                selectedValue={services}
                onValueChange={()=>{}}>
                {services.map((key) => {
                    return (<Picker.Item label={key.id} value={key.subject} key={key.id}/>)
                })}
            </Picker>
        }
            else
        {
            return <Text>Test</Text>
        }
    }

    async function chooseFiles()
    {
        let result = DocumentPicker.getDocumentAsync({
            type: "*/*",
            //type: "image/*",
            // type: "audio/*",
            // type: "application/*",
            // type: "application/pdf",
            // type: "application/msword",
            // type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            // type: "vnd.ms-excel",
            // type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            // type: "text/csv",
        })
        const Mydata = new FormData();
        Mydata.append('file', result);
        setFile(Mydata);
        // const dirInfo = FileSystem.getInfoAsync();
        console.log(result);
        sendFile();
    }

    async function sendFile()
    {
        console.log('response');
        console.log(file);
        // console.log('response');
        // console.log(file['_parts'][0][1]['_W']['name']);
        var name = file['_parts'][0][1]['_W']['name'];
        var size = file['_parts'][0][1]['_W']['size'];
        var uri = file['_parts'][0][1]['_W']['uri'];
        let body = new FormData();
        body.append('file', { uri: uri, name: name, size: size, type: 'JPG' });
        body.append('', '\\')
        console.log('formData');
        const response = await fetch(
            'http://api.smart24.kz/storage/v1/file/upload',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': '*/*',
                    'x-api-key': token,
                },
                body,
            })
            .then(response => {
                return response.json()
                    .then(responseJson => {
                        setSendedFileId(responseJson.id)
                        console.log(responseJson.id);
                        console.log(responseJson.name);
                    });
                });
        console.log('finish');
    }

    return (
        <Container>
            <Header style={styles.headerTop}>
                <Left style={{ flex: 1 }}>
                    <Ionicons
                        name="md-arrow-back"
                        style={{ color: '#1a192a', marginLeft: 10 }}
                        onPress={() => navigation.goBack()}
                        size={24}
                    />
                </Left>
                <Body style={{ flex: 3 }}>
                    <Title style={{ color: '#1a192a', fontSize: 20 }}>
                        Новая заявка
                    </Title>
                </Body>
                <Right />
            </Header>
            <Content style={{ paddingHorizontal: 20, backgroundColor: '#fff' }}>
                <View style={{ paddingHorizontal: 20, backgroundColor: '#fff', marginTop: 20 }}>
                    <View style={{ marginVertical: 10 }}>
                        {/*{_renderShifts()}*/}
                        {/*{ _renderServices() }*/}
                        <View style={{zIndex: 10}}>
                            <Text>Выберите каталог</Text>
                            {catalogs != undefined ?
                                <DropDownPicker
                                    style={{backgroundColor: '#F2F2F2', borderRadius: 10,}}
                                    items={catalogs.map(item=> ({label: item.name, value: item.id}))}
                                    onChangeItem={item => setSelectedCatalog(item.value)}
                                    dropDownStyle={{backgroundColor: '#F2F2F2'}}
                                    zIndex={1000}
                                />
                                :
                                null
                            }
                        </View>
                        <View style={{zIndex: 9, marginTop: 20}}>
                            <Text>Выберите услугу</Text>
                            {services != undefined ?
                                <DropDownPicker style={{backgroundColor: '#F2F2F2', borderRadius: 10}}
                                                items={services.map(item=> ({label: item.subject, value: item.id}))}
                                                onChangeItem={item => setSelectedService(item.value)}
                                                dropDownStyle={{backgroundColor: '#F2F2F2'}}
                                                zIndex={1000}
                                />
                                :
                                null
                            }
                        </View>
                        <View style={{zIndex: -10, marginTop: 20}}>
                            <TextInput
                                placeholder="Опишите услугу"
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={setOfferDescr}
                                value={offerDescr}
                                style={{height: 100, backgroundColor: '#F2F2F2', borderRadius: 10}}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Button full primary
                                    onPress={() => chooseFiles()}
                                    style={{backgroundColor: '#F2F2F2', justifyContent: 'space-between', borderRadius: 10,}}
                            >
                                <Text style={{color: '#616161'}}>Вложение</Text>
                                <Icon style={{color: '#616161'}} name='paper'/>
                            </Button>
                        </View>
                    </View>
                    <Button
                        block
                        style={{
                            marginVertical: 10,
                            backgroundColor: !shedId ? '#313B73' : '#222e73',
                            zIndex: -10,
                            borderRadius: 10,
                        }}
                        onPress={() => createOffer()}>
                        <Text style={{ color: !shedId ? '#fff' : '#fff' }}>
                            Создать заявку
                        </Text>
                        <FontAwesome style={{color: '#fff'}} name="send-o" size={24} color="black" />
                    </Button>
                </View>
            </Content>
            <Footer style={{ backgroundColor: '#1a192a', height: 30 }}>
                {/*<FooterTab style={{ backgroundColor: '#1a192a' }}></FooterTab>*/}
            </Footer>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTop: {
        backgroundColor: '#fff',
    },
});
