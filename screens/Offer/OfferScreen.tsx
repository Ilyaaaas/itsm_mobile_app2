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
    Text,
    Left,
    Right,
    Body,
    Footer,
    Icon,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as DocumentPicker from 'expo-document-picker';

const BottomTab = createBottomTabNavigator();

export default function OfferScreen({ navigation }) {
    const [datesWhitelist, setDatesWhitelist] = useState([
        {
            start: moment(),
            end: moment().add(20, 'days'),
        },
    ]);

    const [customDatesStyles, setDatesStyles] = useState([]);
    const [sendedFileId, setSendedFileId] = useState(0);
    const [sendedFileName, setSendedFileName] = useState('');
    const [reqId, setReqId] = useState([]);
    const [sendFileState, setSendFileState] = useState(false);

    const [openCheck, setOpenCheck] = useState(false);
    const [firstClick, setfirstClick] = useState(true);
    const [typeUrl, setTypeURL] = useState(0);
    const [vidPriem, setVidPriem] = useState('');
    const [offerDescr, setOfferDescr] = useState('');
    const [services, setServices] = useState();
    const [catalogs, setCatalogs] = useState();
    const [file, setFile] = useState();
    const [selectedService, setSelectedService] = useState();
    const [selectedCatalog, setSelectedCatalog] = useState();
    const [token, setToken] = useState('');
    const form = useSelector((state) => state.form);
    const { date = [], time = '', times = [], shedId = '' } = form;
    const dispatch = useDispatch();

    useEffect(() => {
        // console.log({route.params});
        async function fetchMyAPI() {
            await AsyncStorage.getItem('accessToken').then(req => JSON.parse(req))
                .then(json =>
                {
                    setToken(json[0].accessToken);
                    getServices(json[0].accessToken, 0);
                    getCatalogs(json[0].accessToken);
                })
                .catch(error => console.log(error))

        }
        fetchMyAPI()

    }, [])

    async function _getToken()
    {
        await AsyncStorage.getItem('accessToken2').then(req => JSON.parse(req))
            .then(json => setToken(json[0].accessToken))
            .catch(error => console.log(error))
    }

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

        // var fileInfo = sendFile(file)

        await fetch('http://api.smart24.kz/service-requests/v1/request',
            {
                method:'POST',
                headers: {"x-api-key": token,
                    'Accept':       'application/json',
                    'Content-Type': 'application/json',
                },
                body: '{"product_id": "'+selectedService+'", "descr": "'+offerDescr+'"}'}
        )
            .then(response => response.json())
            .then(function(data){
                // setReqId(data);
                sendFileId(data.id, sendedFileId, sendedFileName);
            })
            .catch(error => console.error(error))
            .finally()
        alert('Заявка успешно отправлена!');
        navigation.goBack();
    }

    const getCatalogs = async (tokenParam) =>
    {
        var usingToken = token;
        if(token == '')
        {
            usingToken = tokenParam
        }
        fetch('http://api.smart24.kz/service-catalog/v1/catalog?access-token='+usingToken+'&_format=json',
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

    const getServices = async (tokenParam, catalogId) =>
    {
        var usingToken = token;
        if(token == '')
        {
            usingToken = tokenParam
        }
        fetch('http://api.smart24.kz/service-catalog/v1/product?access-token='+usingToken+'&_format=json',
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

    function changeSelectedCatalog(selectedCatalogId)
    {
        setSelectedCatalog(selectedCatalogId);
        getServices(token, selectedCatalogId);
    }

    async function chooseFiles()
    {
        console.log('chooseFiles');
        let result = await DocumentPicker.getDocumentAsync({
            type: "*/*",
        })
        const Mydata = new FormData();
        Mydata.append('file', result);
        console.log('tststs')
        // setFile(Mydata);
        // setSendFileState(true)
        var name = Mydata['_parts'][0][1].name;
        var size = Mydata['_parts'][0][1].size;
        var uri = Mydata['_parts'][0][1].uri;
        console.log('tststs')
        let body = new FormData();
        body.append('file', { uri: uri, name: name, size: size, type: 'JPG' });
        console.log('body '+uri+' '+name+' '+size);
        fetch(
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
                console.log('fetch');
                return response.json()
            })
            .then(responseJson => {
                setSendedFileId(responseJson.id)
                setSendedFileName(responseJson.name)
                console.log('responseJson2');
                console.log(responseJson);
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        if(sendFileState == true)
        {
            if(file != undefined)
            {
                console.log('sendFile все условия сработали')
                // sendFileByAxios(file)
                // sendFile(file)
                setSendFileState(false)
            }
        }
    });

    async function sendFileByAxios(fileArg) {
        var name = fileArg['_parts'][0][1].name;
        var size = fileArg['_parts'][0][1].size;
        var uri = fileArg['_parts'][0][1].uri;
        let body = new FormData();
        body.append('file', { uri: uri, name: name, size: size, type: 'JPG' });
        console.log('333 '+uri+' '+name+' '+size);
        await axios({
            url    : 'http://api.smart24.kz/storage/v1/file/upload',
            method : 'POST',
            data   : body,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                'x-api-key': token,
            }
        })
            .then(function (response) {
                console.log("response :", response);
                setSendedFileId(response.data.id)
                setSendedFileName(response.data.name)
                console.log(response.data.name);
                console.log(response.data.id);
            })
            .catch(function (error) {
                console.log('errorerror');
                console.log(error);
            })
    }

    async function sendFile(fileArg)
    {
        console.log('sendFile');
        var name = fileArg['_parts'][0][1].name;
        var size = fileArg['_parts'][0][1].size;
        var uri = fileArg['_parts'][0][1].uri;
        let body = new FormData();
        body.append('file', { uri: uri, name: name, size: size, type: 'JPG' });
        console.log('body '+uri+' '+name+' '+size);
        fetch(
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
                console.log('fetch');
                return response.json()
            })
            .then(responseJson => {
                setSendedFileId(responseJson.id)
                setSendedFileName(responseJson.name)
                console.log('responseJson2');
                console.log(responseJson);
            })
            .catch(error => console.error(error));
        console.log('finish');
    }

    async function sendFileId(reqId, sendedFileId, sendedFileName)
    {
        console.log(reqId);
        console.log('{"fileId": '+sendedFileId+', "typeId": 2, "descr": "'+sendedFileName+'"}');
        fetch("http://api.smart24.kz/service-requests/v1/request/"+reqId+"/add-attachments", {
            body: '{"fileId": '+sendedFileId+', "descr": "'+sendedFileName+'"}',
            headers: {
                "Content-Type": "application/json",
                "X-Api-Key": token
            },
            method: "POST"
        })
            .then(response => response.json())
            .then(function(data){
                console.log('sendFileId');
                console.log(data);
                console.log('sendFileId');
            })
            .catch(error => console.error(error))
            .then()
            .finally()
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
                        <View style={{zIndex: 1}}>
                            <Text>Выберите каталог</Text>
                            {catalogs != undefined ?
                                <DropDownPicker
                                    style={{backgroundColor: '#F2F2F2', borderRadius: 10,}}
                                    items={catalogs.map(item=> ({label: item.name, value: item.id}))}
                                    // onChangeItem={item => setSelectedCatalog(item.value)}
                                    onChangeItem={item => changeSelectedCatalog(item.value)}
                                    dropDownStyle={{backgroundColor: '#F2F2F2'}}
                                    zIndex={1000}
                                    placeholder={'Не выбрано'}
                                />
                                :
                                <Text>Загрузка...</Text>
                            }
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text>Выберите услугу</Text>
                            {services != undefined ?
                                <DropDownPicker style={{backgroundColor: '#F2F2F2', borderRadius: 10}}
                                                items={services.map(item=> ({label: item.subject, value: item.id}))}
                                                onChangeItem={item => setSelectedService(item.value)}
                                                // onChangeItem={item => changeSelectedService(item.value)}
                                                dropDownStyle={{backgroundColor: '#F2F2F2'}}
                                    // zIndex={1000}
                                                placeholder={'Не выбрано'}
                                />
                                :
                                <Text>Загрузка...</Text>
                            }
                        </View>
                        <View style={{zIndex: -10, marginTop: 20}}>
                            <TextInput
                                placeholder="Опишите услугу"
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={setOfferDescr}
                                value={offerDescr}
                                style={{height: 100, backgroundColor: '#F2F2F2', borderRadius: 10, padding: 10}}
                            />
                        </View>
                        <View style={{marginTop: 20}}>
                            <Text>{sendedFileName || "Файл не выбран"}</Text>
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
