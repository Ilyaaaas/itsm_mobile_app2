import React from 'react';
import {AntDesign, Ionicons, MaterialIcons} from '@expo/vector-icons';
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Title,
    Right,
    List,
    ListItem,
    Toast,
    Accordion,
    Input
} from 'native-base';
import {
    Switch,
    StyleSheet,
    Text,
    AsyncStorage,
    RefreshControl,
    View,
    Image,
    Button,
    TouchableOpacityComponent
} from 'react-native';

import moment from "moment";
import { API, getToken } from '../constants';
import * as _ from 'lodash';
import {Checkbox} from "react-native-paper";

class DiaryScreen extends React.Component
{
    state = {
        trueCheckBoxIsOn: true,
        falseCheckBoxIsOn: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            token: '7BdnodhTCnNRdUY1n2ZJYJP7SvfFgbCL',
            refreshing: false,
            user: {},
            list : [],
            sortBy: 'desc',
            activeId: 0,
            modal: false,
            ls: {},
            personName: '',
            lastName: '',
            checkBoxIsOn: true,
        }
    }

    _getToken = async () => {
        await getToken().then(itoken => {
            this.setState({token: itoken});
        })
    }

    _getUserData = () => {
        AsyncStorage.getItem('user_data').then((value) => {
            if (value) {
                const obj = JSON.parse(value);
                this.setState({ user: obj });
            }
        });
    };

    _getList = async () => {
        const API_URL = `http://api.smart24.kz/portal/v1/user/3470?access-token=`+this.state.token;

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
                // if(responseJson.success == false){
                //     Toast.show({
                //         text: responseJson.message,
                //         type: 'danger',
                //         duration: 3000
                //     });
                //     return;
                // }

                this.setState({ list: responseJson });
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }
    }

    _refreshPage = async () => {
        this.setState({refreshing: true});
        // await this._getToken();
        await this._getUserData();
        this._getList();
        this.setState({refreshing: false});
    }

    UNSAFE_componentWillMount() {
        this._refreshPage();
    }

    UNSAFE_componentWillReceiveProps() {
        this._refreshPage();
    }

    _renderContent  = (item) => {
        console.log(item);
        return (
            <View>
                {item.id == '1' ?
                    <View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10}}>Получать PUSH уведомления</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={"#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => this.handleChecked()}
                                value={this.state.checkBoxIsOn}
                                style={{marginRight: 10}}
                            />
                        </View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10}}>Получать SMS уведомления</Text>
                            <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={"#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => this.handleChecked()}
                            value={this.state.checkBoxIsOn}
                            style={{marginRight: 10}}
                            />
                        </View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10}}>Получать уведомления по почте</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={"#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => this.handleChecked()}
                                value={this.state.checkBoxIsOn}
                                style={{marginRight: 10}}
                            />
                        </View>
                    </View>
                    :
                item.id == '2' ?
                    <View style={{flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: 50,
                        alignItems: 'center',
                    }}>
                        <Text style={{textAlign: 'left', marginLeft: 10}}>Требуется развозка</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={"#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => this.handleChecked()}
                            value={this.state.checkBoxIsOn}
                            style={{marginRight: 10}}
                        />
                    </View>
                    :
                    <View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                            marginRight: 10,
                            marginLeft: 10,
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, width: 80,}}>Имя</Text>
                            <Input
                                   style={styles.input}
                                   placeholder={'Имя'}
                            />
                        </View>
                        <View style={{flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        height: 50,
                                        alignItems: 'center',
                                        marginRight: 10,
                                        marginLeft: 10,
                                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, width: 80,}}>Фамилия</Text>
                            <Input
                                style={styles.input}
                                placeholder={'Фамилия'}
                            />
                        </View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                            marginRight: 10,
                            marginLeft: 10,
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, width: 80,}}>Отчество</Text>
                            <Input
                                style={styles.input}
                                placeholder={'Отчество'}
                            />
                        </View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                            marginRight: 10,
                            marginLeft: 10,
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, width: 80,}}>Почта</Text>
                            <Input
                                style={styles.input}
                                placeholder={'Почта'}
                            />
                        </View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                            marginRight: 10,
                            marginLeft: 10,
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, width: 80,}}>Рабочий телефон</Text>
                            <Input
                                style={styles.input}
                                placeholder={'Рабочий телефон'}
                            />
                        </View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                            marginRight: 10,
                            marginLeft: 10,
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, width: 80,}}>Мобильный телефон</Text>
                            <Input
                                style={styles.input}
                                placeholder={'Мобильный телефон'}
                            />
                        </View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                            marginRight: 10,
                            marginLeft: 10,
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, width: 80,}}>Номер кабинета</Text>
                            <Input
                                style={styles.input}
                                placeholder={'Номер кабинета'}
                            />
                        </View>
                        <View>
                            <Button
                            style={{
                                marginVertical: 10,
                                backgroundColor: '#42976f'
                            }} title={'Сохранить'} onPress={() => alert('test')}/>
                        </View>
                    </View>
                }
            </View>
        );
    }

    handleChecked = () =>
    {
        var checkBoxState = true;
        if(this.state.checkBoxIsOn == true)
        {
            checkBoxState = false;
        }
        this.setState({checkBoxIsOn: checkBoxState})
    }

    render() {
        const dataArray = [
            { id: 0, title: "Контакты", content: 'username' },
            { id: 1, title: "Настройки", content: "Нет доступных настроек" },
            { id: 2, title: "Развозка", content: "Нет уведомлений" }
        ];
        return (
            <Container>
                <Header style={styles.headerTop}>
                    <Left>
                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: '#1a192a' }}>Профиль</Title>
                    </Body>
                    <Right>
                        <AntDesign
                            name="edit"
                            size={24}
                            color="#1a192a"
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                this.getDiaryView(0);
                            }}
                        />
                    </Right>
                </Header>
                <Content
                    style={{alignContent: 'center'}}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._refreshPage}
                        />
                    }
                >
                    <ListItem style={{alignSelf: 'center',}}>
                        <View>
                            {this.state.list.avaFile == null ?
                                <Image style={styles.message_img} source={{uri: 'https://smart24.kz/img/default/ava_businessman_400.jpg'}}></Image>
                                :
                                <Image style={styles.message_img} source={{uri: 'https://smart24.kz/'+this.state.list.avaFile}}></Image>
                            }
                            <View>
                                <Text style={{fontSize: 30, color: '#898989', textAlign: "center",}}>{this.state.list.personName}</Text>
                                <Text style={{fontSize: 14, color: '#898989', textAlign: "center",}}>{this.state.list.companyName}</Text>
                                <Text style={{fontSize: 14, color: '#898989', textAlign: "center",}}>{this.state.list.username}</Text>
                            </View>
                        </View>
                    </ListItem>
                    <Content padder>
                        <Accordion dataArray={dataArray} expanded={0} renderContent={this._renderContent}/>
                    </Content>
                </Content>
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
        backgroundColor: '#fff',
    },
    message_img:
        {
            width: 120,
            height: 120,
            borderRadius: 120,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
        },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        width: 20,
        marginRight: 10,
        marginLeft: 10,
        height: 30,
    },
});

export default DiaryScreen;
