import React from 'react';
import {AntDesign, Ionicons, MaterialIcons} from '@expo/vector-icons';
import {Container, Content, Header, Left, Body, Title, Right, List, ListItem, Toast, Accordion} from 'native-base';
import {CheckBox, StyleSheet, Text, AsyncStorage, RefreshControl, View, Image} from 'react-native';
// import { Checkbox } from 'react-native-paper';

import moment from "moment";
import { API, getToken } from '../constants';
import * as _ from 'lodash';
import {Button, Checkbox} from "react-native-paper";

class DiaryScreen extends React.Component
{
    state = {
        trueCheckBoxIsOn: true,
        falseCheckBoxIsOn: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            token: 'd0vpCxftx4VxTyMimUBhwCEgyvGp4qJK',
            refreshing: false,
            user: {},
            list : [],
            sortBy: 'desc',
            activeId: 0,
            modal: false,
            ls: {},
            personName: '',
            lastName: '',
            checkBoxIsOn: 'checked',
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
        const API_URL = `${API}portal/v1/user/3470?access-token=d0vpCxftx4VxTyMimUBhwCEgyvGp4qJK`;

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
            console.log('responseJson');
            console.log(responseJson);

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

    _renderContent(item) {
        console.log(item);
        return (
            <View>
                {item.id == '1' ?
                    <Checkbox.Item
                        status={'checked'}
                        color="#a2a3b7"
                        onPress={() => this.handleChecked()}
                        label="Получать PUSH уведомления"
                        style={{ width:"90%" }}
                    />
                    :
                    null
                }
            </View>
        );
    }

    handleChecked = () => {
        var checkBoxState = 'unchecked';
        if(this.state.checkBoxIsOn == 'unchecked')
        {
            checkBoxState = 'checked';
        }
        this.setState({checkBoxIsOn: checkBoxState})
    };

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
                        <Title style={{ color: '#a2a3b7' }}>Профиль</Title>
                    </Body>
                    <Right>
                        <AntDesign
                            name="edit"
                            size={24}
                            color="#a2a3b7"
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
                        <Accordion dataArray={dataArray} expanded={0} renderContent={this._renderContent}
                        />
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
        backgroundColor: '#1a192a',
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
});

export default DiaryScreen;
