import React from 'react';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {Container, Content, Header, Left, Body, Title, Right, List, ListItem, Toast} from 'native-base';
import {StyleSheet, Text, AsyncStorage, RefreshControl} from 'react-native';

import moment from "moment";
import { API, getToken } from '../constants';
import * as _ from 'lodash';
import {Button} from "react-native-paper";

class DiaryScreen extends React.Component
{
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
        const API_URL = `${API}backend/diary`;

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
                    return;
                }

                this.setState({ list: responseJson.result });
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

    getDiaryView = (ids) => {
        this.props.navigation.navigate('DiaryScreenView', {
            id: ids
        });
    }

    UNSAFE_componentWillMount() {
        this._refreshPage();
    }

    UNSAFE_componentWillReceiveProps() {
        this._refreshPage();
    }

    getSorted = ({list}: { list: any }) => {
        const sortedList = _.sortBy(list, (a) =>
            moment(a.date_set, 'YYYY/MM/DD HH:mm:ss')
        );

        return this.state.sortBy === 'desc' ? _.reverse(sortedList) : sortedList;
    };

    handleSortBy = () => {
        this.setState(
            {
                sortBy: this.state.sortBy === 'desc' ? 'asc' : 'desc',
            },
            () => {
                this.setState({
                    list: this.getSorted({list: this.state.list})
                });
            }
        );
    };

    _viewModal = async (value: any) => {
        this.props.navigation.navigate('DiaryScreenResult', {
            list: value
        });
    }

    render() {
        return (
            <Container>
                <Header style={styles.headerTop}>
                    <Left style={{ flex: 1}}>
                        <Ionicons name="ios-menu"
                                  style={{ color: '#046475', marginLeft: 10 }}
                                  onPress={() => this.props.navigation.openDrawer()}
                                  size={24}
                        />
                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: '#046475' }}>Дневник пациента</Title>
                    </Body>
                    <Right>
                        <AntDesign
                            name="pluscircleo"
                            size={24}
                            color="#046475"
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                this.getDiaryView(0);
                            }}
                        />
                    </Right>
                </Header>
                <Content
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._refreshPage}
                        />
                    }
                >
                    <ListItem>
                        <Ionicons
                            name="ios-person"
                            style={{ fontSize: 40, paddingVertical: 5 }}
                        />
                        <Body style={{ paddingLeft: 10 }}>
                            <Text style={{ fontSize: 20, paddingVertical: 5 }}>
                                { this.state.user.fname } { this.state.user.sname }
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                                { this.state.user.bday }
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                                { this.state.user.iin }
                            </Text>
                        </Body>
                    </ListItem>
                    {this.state.list.length > 1? (
                    <ListItem>
                        <Button
                            icon={
                                this.state.sortBy === 'desc' ? 'chevron-down' : 'chevron-up'
                            }
                            onPress={this.handleSortBy}>
                            Сортировать по дате
                        </Button>
                    </ListItem>
                    ) : (
                        <Text></Text>
                    )}
                    {this.state.refreshing ? (
                        <Text style={{ textAlign: "center", fontSize: 14, flex: 1, marginTop: 20, width: '100%' }}>Подождите идет загрузка данных</Text>
                    ) : (
                    <List>
                        {this.state.list.map((value, i) => (
                            <ListItem
                                key={i}
                                style={{ paddingBottom: 5, paddingTop: 5 }}
                                onPress={() => { this._viewModal(value); }}
                            >
                                <Text style={{ fontSize: 14, marginTop: 10, marginBottom: 10 }}>Запись наблюдения { value.date_set  }</Text>
                            </ListItem>
                        ))}
                    </List>
                    )}
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
        backgroundColor: '#01A19F',
    },
});

export default DiaryScreen;