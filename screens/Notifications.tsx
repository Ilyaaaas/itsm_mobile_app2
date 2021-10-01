import React from "react";
import {
    AsyncStorage,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {
    Body,
    Container,
    Header,
    Left,
    Tab,
    TabHeading,
    Tabs,
    Title,
    Toast,
    Content,
    List,
    ListItem,
    Root, Button
} from "native-base";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {API, getToken} from './constants';
import { WebView } from 'react-native-webview';
import DropDownPicker from "react-native-dropdown-picker";

export default class Notifications extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            list_new: [],
            list_old: [],
            activeTab: 0,
            refreshing: false,
            reqModal: false,
            currentNotifId: 0,
        }

        this.isFocused = this.props.navigation.isFocused();
        this.veryImportantDataThatCanBeStoredOnlyAfterMount = '';
    }

    _getToken = async () => {
        await AsyncStorage.getItem('accessToken').then(req => JSON.parse(req))
            .then(json => this.setState({token: json[0].accessToken}))
            .catch(error => console.log(error))
    }

    _getUrl = async (url) => {
        const API_URL = `${API}${url}`;
        console.log('API_URL');
        console.log(API_URL);

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': this.state.token,
                },
            })

            const responseJson = await response;
            // console.log('_getUrl');
            // console.log(responseJson.json());
            return responseJson.json();
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }
        return null;
    }

    _list = async () => {
        var readedNotif = [];
        var unreadedNotif = [];
        await this._getUrl('portal/v1/notification?access-token='+this.state.token+'&_format=json').then(list => {
            if(list !== null) {
                list.items.map((reqItem, results) => {
                    if (reqItem.isRead === 0) {
                        this.setState({list_new: [...this.state.list_new, reqItem]})
                    } else if (reqItem.isRead === 1) {
                        this.setState({list_old: [...this.state.list_old, reqItem]})
                    }
                })
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

    openNotif = (id) => {
        this.setState({ filterModal: false});
        Toast.show({
            text: 'На данный момент функция уведомлений дорабатывается. В следующем обновлении мы включим данную функцию.',
            type: 'warning',
            duration: 3000
        });
        // this.setState({reqModal: true, currentNotifId: id});
    }

    render() {
        return (
            <Container>
                <Header style={styles.headerTop}>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: '#1a192a' }}>Уведомления</Title>
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
                                    {this.state.list_new.map((value_new, nums) => (
                                        <ListItem onPress={() => this.openNotif(value_new.id)} key={value_new.id}>
                                                <View style={{ flexDirection: "column" }}>
                                                    <Text style={{ fontSize: 16 }}>{ value_new.name }</Text>
                                                    <Text style={{ fontSize: 12, marginTop: 5, color: '#6f6f6f' }}></Text>
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
                                    {this.state.list_old.map((value_new, nums) => (
                                        <ListItem onPress={() => this.openNotif(value_new.id)} key={value_new.id}>
                                                <View style={{ flexDirection: "column" }}>
                                                    <Text style={{ fontSize: 16 }}>{ value_new.name }</Text>
                                                    <Text style={{ fontSize: 12, marginTop: 5, color: '#6f6f6f' }}></Text>
                                                </View>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Tab>
                    </Tabs>
                </Content>
                <Modal
                    animationType={"slide"}
                    visible={this.state.reqModal}
                >
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <View>
                            <Text>{this.state.currentNotifId}</Text>
                        </View>
                    </View>
                    <View style={{ borderTopWidth: 1,}}>
                        <List>
                            <ListItem>
                                <Left>
                                    <Button
                                        success={true}
                                        style={{ width: '90%', borderRadius: 10 }}
                                        onPress={() => {
                                            this.setState({reqModal: false});
                                        }}
                                    >
                                        <Text style={{ width: '100%', textAlign: "center"}}>Закрыть</Text>
                                    </Button>
                                </Left>
                                <Body>
                                    <Button
                                        block
                                        onPress={() => this.acceptRequest(this.state.listGrade.id)}
                                        style={{backgroundColor: 'green'}}
                                    >
                                        <Text>Начать исполнение</Text>
                                    </Button>
                                </Body>
                            </ListItem>
                        </List>
                    </View>
                </Modal>
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
        backgroundColor: '#fff',
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
