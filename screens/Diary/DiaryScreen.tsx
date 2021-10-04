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
    Input,
    Button,
} from 'native-base';
import {
    Switch,
    StyleSheet,
    Text,
    AsyncStorage,
    RefreshControl,
    View,
    Image,
    Platform,
    Alert,
    TouchableOpacityComponent
} from 'react-native';
import {StackActions} from "@react-navigation/native";

class DiaryScreen extends React.Component
{
    state = {
        trueCheckBoxIsOn: true,
        falseCheckBoxIsOn: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            token: '',
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
            pushNotif: true,
            smshNotif: true,
            emailNotif: true,
            shuttle: true,
            userId: 0,
            personInfo: [],
        }
    }

    _getToken = async () => {
        await AsyncStorage.getItem('accessToken').then(req => JSON.parse(req))
            .then(json => this.setState({token: json[0].accessToken, userId: json[1].userId}))
            .catch(error => console.log(error))
    }

    getPersonId = async (personId) =>
    {
        console.log('this.state.personId');
        console.log(personId);
        // const API_URL = `http://api.smart24.kz/portal/v1/user/`+this.state.userId+`?access-token=`+this.state.token;
        const API_URL = `http://api.smart24.kz/portal/v1/person/`+personId+`?access-token=`+this.state.token;
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
                this.setState({ personInfo: responseJson });
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }
    }

    _getUserData = () => {
        AsyncStorage.getItem('user_data').then((value) => {
            if (value) {
                const obj = JSON.parse(value);
                this.setState({ user: obj });
                console.log('obj');
                console.log(obj);
            }
        });
    }

    _getList = async () => {
        const API_URL = `http://api.smart24.kz/portal/v1/user/`+this.state.userId+`?access-token=`+this.state.token;
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

            console.log(responseJson);
            this.getPersonId(responseJson.personId);
            if (responseJson !== null) {
                this.setState({ list: responseJson });
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }
    }

    _refreshPage = async () => {
        this.setState({refreshing: true});
        await this._getToken();
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

    saveProfileInfo = () => {
        Alert.alert("Предупреждение!", 'На данный момент функция редактирования профиля дорабатывается. В следующем обновлении мы включим данную функцию.');
    }

    _renderContent  = (item) => {
        return (
            <View key={item.id} style={{backgroundColor: '#E0E0E0', borderRadius: 5, marginBottom: 10}}>
                {item.id == '1' ?
                    <View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, color: '#898989'}}>Получать PUSH уведомления</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={"#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => this.setState({pushNotif: !this.state.pushNotif})}
                                value={this.state.pushNotif}
                                style={{marginRight: 10}}
                            />
                        </View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, color: '#898989'}}>Получать SMS уведомления</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={"#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => this.setState({smsNotif: !this.state.smsNotif})}
                                value={this.state.smsNotif}
                                style={{marginRight: 10}}
                            />
                        </View>
                        <View style={{flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            height: 50,
                            alignItems: 'center',
                        }}>
                            <Text style={{textAlign: 'left', marginLeft: 10, color: '#898989'}}>Получать уведомления по почте</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={"#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => this.setState({emailNotif: !this.state.emailNotif})}
                                value={this.state.emailNotif}
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
                            <Text style={{textAlign: 'left', marginLeft: 10, color: '#898989'}}>Требуется развозка</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#81b0ff" }}
                                thumbColor={"#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => this.setState({shuttle: !this.state.shuttle})}
                                value={this.state.shuttle}
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
                                <Text style={{textAlign: 'left', marginLeft: 10, width: 80, color: '#898989'}}>Имя</Text>
                                <Input
                                    style={styles.input}
                                    placeholder={'Имя'}
                                    value={this.state.personInfo.firstName}
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
                                <Text style={{textAlign: 'left', marginLeft: 10, width: 80, color: '#898989'}}>Фамилия</Text>
                                <Input
                                    style={styles.input}
                                    placeholder={'Фамилия'}
                                    value={this.state.personInfo.lastName}
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
                                <Text style={{textAlign: 'left', marginLeft: 10, width: 80, color: '#898989'}}>Отчество</Text>
                                <Input
                                    style={styles.input}
                                    placeholder={'Отчество'}
                                    value={this.state.personInfo.middleName}
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
                                <Text style={{textAlign: 'left', marginLeft: 10, width: 80, color: '#898989'}}>Почта</Text>
                                <Input
                                    style={styles.input}
                                    placeholder={'Почта'}
                                    value={this.state.personInfo.username}
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
                                <Text style={{textAlign: 'left', marginLeft: 10, width: 80, color: '#898989'}}>Рабочий телефон</Text>
                                <Input
                                    style={styles.input}
                                    placeholder={'Рабочий телефон'}
                                    value=''
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
                                <Text style={{textAlign: 'left', marginLeft: 10, width: 80, color: '#898989'}}>Мобильный телефон</Text>
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
                                <Text style={{textAlign: 'left', marginLeft: 10, width: 80, color: '#898989'}}>Номер кабинета</Text>
                                <Input
                                    style={styles.input}
                                    placeholder={'Номер кабинета'}
                                />
                            </View>
                            <View>
                                <Button style={{
                                        backgroundColor: '#0abb87',
                                        borderRadius: 15,
                                        shadowColor: '#989898',
                                        height: 60,
                                        padding: 20,
                                        borderWidth: 10,
                                        borderColor: '#E0E0E0',
                                        width: '100%',
                                    }}
                                    onPress={() => this.saveProfileInfo()}
                                >
                                    <Text style={{ width: '100%', textAlign: "center", color: '#fff', fontSize: 16}}>Сохранить</Text>
                                </Button>
                            </View>
                        </View>
                }
            </View>
        );
    }

    _renderHeaderIOS  = (item) => {
        return (
            <View
                key={item.id}
                style={{
                    borderWidth: 0.2,
                    borderColor: '#898989',
                    borderRadius: 10,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 50,
                    alignItems: 'center',
                    shadowColor: '#898989',
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowRadius: 2,
                    shadowOpacity: 0.5,
                    marginBottom: 10,
                    backgroundColor: 'white',
                }}>
                <View style={{width: 60, }}>
                    {item.id == '0' ?
                        <MaterialIcons
                            name="contacts"
                            size={18}
                            style={{
                                color: '#898989',
                                paddingLeft: 20,
                            }}/>
                        :
                        item.id == '1' ?
                            <Ionicons name="ios-settings"
                                      size={18}
                                      style={{
                                          color: '#898989',
                                          paddingLeft: 20,
                                      }}/>
                            :
                            <MaterialIcons
                                name="airport-shuttle"
                                size={18}
                                style={{
                                    color: '#898989',
                                    paddingLeft: 20,
                                }} />
                    }
                </View>
                <Body style={{paddingLeft: -40, width: 400, alignItems: 'left', justifyContent: 'flex-start'}}>
                    <Text style={{color: '#898989', textAlign: 'left', fontSize: 14, justifyContent: 'flex-start', alignContent: 'flex-start'}}>
                        {item.title}
                    </Text>
                </Body>
                <Right>
                    <AntDesign
                        name="down"
                        size={12}
                        color='#898989'
                        style={{marginRight: 10}}
                    />
                </Right>
            </View>
        );
    }

    _renderHeaderAndroid  = (item) => {
        return (
            <View
                key={item.id}
                style={{
                    borderWidth: 0.2,
                    borderColor: '#898989',
                    borderRadius: 10,
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 50,
                    alignItems: 'center',
                    shadowColor: '#898989',
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowRadius: 2,
                    shadowOpacity: 0.5,
                    marginBottom: 10,
                    backgroundColor: 'white',
                }}>
                <View style={{width: 60, }}>
                    {item.id == '0' ?
                        <MaterialIcons
                            name="contacts"
                            size={18}
                            style={{
                                color: '#898989',
                                paddingLeft: 20,
                            }}/>
                        :
                        item.id == '1' ?
                            <Ionicons name="ios-settings"
                                      size={18}
                                      style={{
                                          color: '#898989',
                                          paddingLeft: 20,
                                      }}/>
                            :
                            <MaterialIcons
                                name="airport-shuttle"
                                size={18}
                                style={{
                                    color: '#898989',
                                    paddingLeft: 20,
                                }} />
                    }
                </View>
                <Text style={{
                    color: '#898989',
                    textAlign: 'left', fontSize: 14, justifyContent: 'flex-start', alignContent: 'flex-start'
                }}>
                    {item.title}
                </Text>
                <AntDesign
                    name="down"
                    size={12}
                    color='#898989'
                    style={{marginRight: 10}}
                />
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

    logout = () =>
    {
        // const handleSubmit = async (onSaveLogin = false) => {
        //     let data = {
        //         method: 'POST',
        //         credentials: 'same-origin',
        //         mode: 'same-origin',
        //         body: JSON.stringify({
        //             // username: login,
        //             // password: password,
        //             // username: 'i.akhmetov@digital.sk.kz',
        //             // password: 'Astana2022!',
        //             // username: 'a.iskaliyev@skbs.kz',
        //             // password: 'U7cXPraHSU',
        //             username: 'b.rysbek@skbs.kz',
        //             password: 'ec682c6',
        //         }),
        //         headers: {
        //             'Accept':       'application/json',
        //             'Content-Type': 'application/json',
        //         }
        //     }
        //
        //     fetch('http://api.smart24.kz/portal/v1/profile/logout', data)
        //         .then(response => response.json())
        //         .then(json => {
        //                 this.props.navigation.navigate('Login');
        //             }
        //         )
        // };
        this.props.navigation.navigate('Login');
    }

    render() {
        const dataArray = [
            { id: 0, title: "Контакты", content: 'username' },
            { id: 1, title: "Настройки", content: "Нет доступных настроек" },
            // { id: 2, title: "Развозка", content: "Нет уведомлений" }
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
                        <MaterialIcons
                            name="exit-to-app"
                            size={24}
                            color="#1a192a"
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                this.logout();
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
                                <Text style={{fontSize: 30, color: '#1a192a', textAlign: "center",}}>{this.state.list.personName}</Text>
                                <Text style={{fontSize: 14, color: '#1a192a', textAlign: "center",}}>{this.state.list.companyName}</Text>
                                <Text style={{fontSize: 14, color: '#898989', textAlign: "center",}}>{this.state.list.username}</Text>
                            </View>
                        </View>
                    </ListItem>
                    <Content padder>
                        {Platform.OS === 'ios' ?
                            <Accordion
                                expanded={[4]}
                                style={{backgroundColor: 'white', shadowColor: 'red'}}
                                dataArray={dataArray}
                                renderContent={this._renderContent}
                                renderHeader={this._renderHeaderIOS}
                            />
                            :
                            <Accordion
                                expanded={[4]}
                                style={{backgroundColor: 'white', shadowColor: 'red'}}
                                dataArray={dataArray}
                                renderContent={this._renderContent}
                                renderHeader={this._renderHeaderAndroid}
                            />
                        }
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
        borderBottomColor: '#898989',
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
        borderRadius: 5,
        width: 20,
        marginRight: 10,
        marginLeft: 10,
        height: 30,
        backgroundColor: 'white',
    },
});

export default DiaryScreen;
