import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {View, StyleSheet, AsyncStorage, Picker, Platform} from 'react-native';
import 'moment/locale/ru';
import CalendarStrip from 'react-native-calendar-strip';
import {AntDesign, Ionicons, Entypo, MaterialIcons} from '@expo/vector-icons';
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
    Toast, Tab, TabHeading, List, Tabs, Input,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Notifications from "expo-notifications";

import { resetFormInfo, setFormInfo } from '../../actions/form-actions';
import { isEmpty, DATE_T, SHED_ID_T, TIME_T, TIMES_T, API, getToken } from '../constants';
import {WebView} from "react-native-webview";
import {Modal} from "react-native-paper";
import {StackActions} from "@react-navigation/native";

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

export default function OfferScreen({ navigation }) {
    const [datesWhitelist, setDatesWhitelist] = useState([
        {
            start: moment(),
            end: moment().add(20, 'days'),
        },
    ]);

    const [customDatesStyles, setDatesStyles] = useState([]);

    const [openCheck, setOpenCheck] = useState(false);
    const [firstClick, setfirstClick] = useState(true);
    const [typeUrl, setTypeURL] = useState(0);
    const [vidPriem, setVidPriem] = useState('');
    const [offerDescr, setOfferDescr] = useState('');
    const [disType, setDisType] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [services, setServices] = useState();
    const [selectedService, setSelectedService] = useState();
    const [token, setToken] = useState('BlUukRU4m5u0oiS8Gt2Xy93EKTq8qwaI');
    const form = useSelector((state) => state.form);
    const { date = [], time = '', times = [], shedId = '' } = form;
    const dispatch = useDispatch();

    useEffect(() => {
        getServices();
    }, []);

    // const handleSubmit = async () => {
    //     alert('handleSubmit');
    //     await fetch("http://api.smart24.kz/service-requests/v1/request", {
    //         method: "POST",
    //         body: "product_id=1083&descr=$offerDescr",
    //         headers: {
    //             "Accept": "application/json",
    //             "Content-Type": "application/json",
    //             "X-Api-Key": "BlUukRU4m5u0oiS8Gt2Xy93EKTq8qwaI"
    //         },
    //     })
    //         .then(response => response.text())
    //         .then(function(data){
    //             console.log(data);
    //         })
    // }

    const createOffer = async () =>
    {
        fetch('http://api.smart24.kz/service-requests/v1/request',
            {
                method:'POST',
                headers: {"x-api-key": 'BlUukRU4m5u0oiS8Gt2Xy93EKTq8qwaI',
                    'Accept':       'application/json',
                    'Content-Type': 'application/json',
                    },
                body: '{"product_id": "1083", "descr": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia"}'}
        )
            .then(response => response.text())
            .then(function(data){
                console.log('response77');
                console.log(data);
                console.log('response77');
            })
            .catch(error => console.error(error))
            .then()
            .finally(console.log('createOffer'))
        // handleSubmit();
    }

    const getServices = async () =>
    {
        fetch('http://api.smart24.kz/service-catalog/v1/product?access-token=BlUukRU4m5u0oiS8Gt2Xy93EKTq8qwaI&_format=json',
            {method:'GET',
                headers: {"x-api-key": token,
                    "Content-type": "application/json",
                    "Accept": "application/json"},
                }
        )
            .then(response => response.json())
            .then(function(data){
                console.log('services');
                console.log(data.items);
                setServices(data.items);
                console.log('services');
            })
            .catch(error => console.error(error))
            .then(console.log('getServices'))
            .finally()
    }

    function _renderServices()
    {
        if(services != undefined)
        {
            console.log('_renderServices');
            console.log(services);
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
                        Новая заявка
                    </Title>
                </Body>
                <Right />
            </Header>
            <Content style={{ paddingHorizontal: 20, backgroundColor: '#edeef4' }}>
                <View style={{ paddingHorizontal: 20, backgroundColor: '#fff', marginTop: 20 }}>
                    <View style={{ marginVertical: 10 }}>
                        {/*{_renderShifts()}*/}
                        { _renderServices() }
                        <View style={{ marginVertical: 10, ...(Platform.OS !== 'android' && {
                                zIndex: 10
                            })}}>
                            <Text style={{ marginBottom: 10 }}>Вид приема</Text>
                            {console.log('tstst')}
                            {console.log(services)}
                            {services != undefined ?
                                <DropDownPicker
                                    items={services.map(item=> ({label: item.subject, value: item.id}))}
                                    // defaultValue={typeUrl}
                                    containerStyle={{height: 40}}
                                    // onChangeItem={item => { setSelectedService(item.id); alert(item.id)}}
                                    onChangeItem={item => setSelectedService(item.value)}
                                />
                                :
                                <Text>test</Text>
                            }
                        </View>
                        <Text>Выберите каталог</Text>
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <Text>Описание</Text>
                        <Input
                            placeholder="Описание"
                            onChangeText={setOfferDescr}
                            value={offerDescr}
                        />
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <Text>Выберите услугу</Text>
                    </View>
                    <View style={{ marginVertical: 10, ...(Platform.OS !== 'android' && {
                            zIndex: 10
                        })}}>
                        <Text style={{ marginBottom: 10 }}>Опишите заявку</Text>
                    </View>
                </View>
                <Button
                    block
                    style={{
                        marginVertical: 10,
                        backgroundColor: !shedId ? '#42976f' : '#42976f',
                    }}
                    onPress={() => createOffer()}>
                    <Text style={{ color: !shedId ? '#fff' : '#fff' }}>
                        <AntDesign style={{color: '#fff'}} name="check" size={24} color="black" />
                        Создать заявку
                    </Text>
                </Button>
            </Content>
            <Footer style={{ backgroundColor: '#1a192a', height: 30 }}>
                <FooterTab style={{ backgroundColor: '#1a192a' }}></FooterTab>
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
        backgroundColor: '#1a192a',
    },
});
