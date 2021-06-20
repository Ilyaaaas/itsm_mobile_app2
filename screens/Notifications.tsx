import React from "react";
import {RefreshControl, StyleSheet, Text, View} from "react-native";
import {Body, Container, Header, Left, Tab, TabHeading, Tabs, Title, Toast, Content, List, ListItem} from "native-base";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {API, getToken} from './constants';

export default class Notifications extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            list_new: [],
            list_old: [],
            activeTab: 0,
            refreshing: false,
        }

        this.isFocused = this.props.navigation.isFocused();
        this.veryImportantDataThatCanBeStoredOnlyAfterMount = '';
    }

    _getToken = async () => {
        await getToken().then(itoken => {
            this.setState({token: itoken});
        })
    }


    _getUrl = async (url) => {
        const API_URL = `${API}backend/${url}`

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    //'Content-Type': 'application/x-www-form-urlencoded',
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

    _list = async () => {
        await this._getUrl('notifications').then(list => {
            if(list !== null) {
                this.setState({list_new: list.new, list_old: list.old});
            }
        })
    }
    _refreshPage = async () => {
        await this._getToken();
        await this._list();
    }

    componentDidMount = async () => {
        await this._refreshPage();
    }

    _setRead = (id) => {
        this._getUrl('set_notifications_read/'+id).then(list => {
            if(list !== null) {
                this.setState({list_new: list.new, list_old: list.old});
            }
        });
    }

    render() {
        return (
            <Container>
                <Header style={styles.headerTop}>
                    <Left style={{ flex: 1}}>
                        <Ionicons name="ios-menu"
                              style={{ color: '#a2a3b7', marginLeft: 10 }}
                              onPress={() => this.props.navigation.openDrawer()}
                              size={24}
                        />
                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: '#a2a3b7' }}>Уведомления</Title>
                    </Body>
                </Header>
                <Content
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._refreshPage}
                        />
                    }
                >
                    <Tabs
                        tabBarUnderlineStyle={{borderBottomWidth:0}}
                        initialPage={this.state.activeTab}
                        onChangeTab={({ i }) => this.setState({ activeTab: i })}
                    >
                        <Tab heading={
                            <TabHeading style={styles.tab_heading}>
                                <Text style={this.state.activeTab == 0 ? styles.tab_heading_text_active : styles.tab_heading_text}>Новые</Text>
                            </TabHeading>
                        }>
                            {this.state.list_new.length === 0 ? (
                                <NotNotification />
                            ) : (
                                <List>
                                {this.state.list_new.map((value_new, num) => (
                                    <ListItem key={num} onPress={() => {
                                        this._setRead(value_new.id)
                                    }}>
                                        <View style={{ flexDirection: "column" }}>
                                            <Text style={{ fontSize: 16 }}>{ value_new.n_text }</Text>
                                            <Text style={{ fontSize: 12, marginTop: 5, color: '#6f6f6f' }}>{ value_new.n_datetime }</Text>
                                        </View>
                                    </ListItem>
                                ))}
                                </List>
                            )}
                        </Tab>
                        <Tab
                            heading={
                                <TabHeading style={styles.tab_heading}>
                                    <Text style={this.state.activeTab == 1 ? styles.tab_heading_text_active : styles.tab_heading_text}>Прочитанные</Text>
                                </TabHeading>
                            }>
                            {this.state.list_old.length === 0 ? (
                                <NotNotification />
                            ) : (
                                <List>
                                    {this.state.list_old.map((value_old, nums) => (
                                        <ListItem key={nums}>
                                            <View style={{ flexDirection: "column" }}>
                                                <Text style={{ fontSize: 16 }}>{ value_old.n_text }</Text>
                                                <Text style={{ fontSize: 12, marginTop: 5, color: '#6f6f6f' }}>{ value_old.n_datetime }</Text>
                                            </View>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Tab>
                    </Tabs>
                </Content>
            </Container>
        );
    }
}

const NotNotification = () => {
    return(
        <View>
            <Text style={{ textAlign: "center", marginTop: 100 }}>
                <MaterialIcons name="notifications-off" size={100} color="#bababa" />
            </Text>
            <Text style={{ fontSize: 20, marginTop: 20, textAlign: "center", color:"#bababa" }}>Нет уведомлений</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeff4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTop: {
        backgroundColor: '#1a192a',
    },

    tab_heading: {
        backgroundColor: '#eeeff4',
    },
    tab_heading_text: {
        color: '#000000',
        borderWidth: 1,
        width: '80%',
        textAlign: "center",
        borderRadius: 5,
        fontSize: 16,
        borderColor: '#1a192a',
    },
    tab_heading_text_active: {
        color: '#a2a3b7',
        borderWidth: 1,
        width: '80%',
        textAlign: "center",
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: '#1a192a',
        borderColor: '#1a192a',
    },
    txt: {
        color: '#a2a3b7'
    }
});
