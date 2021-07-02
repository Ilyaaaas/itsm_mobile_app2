import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {View, StyleSheet, AsyncStorage, Picker, Platform} from 'react-native';
import 'moment/locale/ru';
import CalendarStrip from 'react-native-calendar-strip';
import {AntDesign, Ionicons, Entypo, MaterialIcons} from '@expo/vector-icons';
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
    Toast, Tab, TabHeading, List, Tabs,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Notifications from "expo-notifications";

import { resetFormInfo, setFormInfo } from '../../actions/form-actions';
import { isEmpty, DATE_T, SHED_ID_T, TIME_T, TIMES_T, API, getToken } from '../constants';
import {WebView} from "react-native-webview";
import {Modal} from "react-native-paper";

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
    const [token, setToken] = useState('');
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
    const [disType, setDisType] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const form = useSelector((state) => state.form);
    const { date = [], time = '', times = [], shedId = '' } = form;
    const dispatch = useDispatch();


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
                                <Text>Выберите каталог</Text>
                                <Tabs
                                    tabBarUnderlineStyle={{borderBottomWidth:0}}
                                    initialPage={activeTab}
                                    onChangeTab={()=>console.log('1')}
                                >
                                    <Tab heading={
                                        <TabHeading>
                                            <Entypo name="flow-tree" size={24} color="black" />
                                            <Text style={{fontSize: 12, textAlign: 'center'}}>Обеспечение бизнеса</Text>
                                        </TabHeading>
                                    }>
                                        <Text>1</Text>
                                    </Tab>
                                    <Tab
                                        heading={
                                            <TabHeading>
                                                <View>
                                                <MaterialIcons name="computer" size={24} color="black" />
                                                </View>
                                                <View>
                                                <Text>Программное обеспечение</Text>
                                                </View>
                                            </TabHeading>
                                        }>
                                        <Text>2</Text>
                                    </Tab>
                                    <Tab
                                        heading={
                                            <TabHeading>
                                                <AntDesign name="setting" size={24} color="black" />
                                                <Text>Другие услуги</Text>
                                            </TabHeading>
                                        }>
                                        <Text>3</Text>
                                    </Tab>
                                </Tabs>
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
                            onPress={() => setOpenCheck(true)}
                            disabled={!shedId}>
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
