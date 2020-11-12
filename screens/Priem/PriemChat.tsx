import React, { Component } from "react";
import {
    AsyncStorage,
    View,
    Text,
    StyleSheet,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    ScrollView, Dimensions, SafeAreaView, Linking, Modal, Vibration
} from "react-native";
import {Body, Content, Header, Footer, Left, List, ListItem, Right, Title, Input, Toast, Container,} from "native-base";
import {AntDesign, Entypo, FontAwesome, Fontisto, Ionicons, MaterialIcons} from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import * as _ from 'lodash';
import {API, WsAPI} from "../constants";
import {fileTypes, typeIcons} from '../fileTypes';
import moment from 'moment';

class PriemChat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            user: {},
            countUsers: 0,
            message: [],
            room: '123',
            open: false,
            refreshing: false,
            wh: Dimensions.get('window'),
            typingUser: '',
            typingText: '',
            chatUsers: [],
            msgText: '',
        }

        this.ws = new WebSocket(WsAPI);
        this.emit = this.emit.bind(this);
    }

    emit() {
        this.setState(prevState => ({
            open: !prevState.open
        }));
        this.socket.send("It worked!")
    };

    _getToken = async () => {
        try {
            const value = await AsyncStorage.getItem('token');

            if (value !== null) {
                const token = value.replace(/['"«»]/g, '');
                this.setState({ token });
                this._getUserData();
            }
        } catch (error) {
            console.log('error' + error);
        }
    };

    _getUserData = async () => {
        try {
            const value = await AsyncStorage.getItem('user_data');

            if (value !== null) {
                const res = JSON.parse(value);
                this.setState({ user: res });
            }
        } catch (error) {
            console.log('error' + error);
        }
    };

    componentWillUnmount() {
        this.ws.close();
    }

    componentDidMount() {
        this.setState({ room: this.props.route.params.roomUrl});

        this.ws.onopen = () => {
            this.ws.send(JSON.stringify({
                roomId: this.state.room,
                token: this.state.token,
                userName: this.state.user.fname+' '+this.state.user.lname,
                action: 'connect'
            }));
        };

        this.ws.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if(data.type === 'user-started-typing'){
                this._typingUser(data.from.name);
            }
            if(data.type === 'user-stopped-typing'){
                this._unTypingUser();
            }
            if(data.type === 'user-disconnected'){
                if(data.from) {
                    this._userDisconected(data.from.name);
                }
            }
            if(data.type === 'user-connected'){
                if(data.from){
                    this._userConnected(data.from.name);
                }
            }
            if(data.type === 'list-users'){
                this._listUsers(data.clients);
            }
            if(data.type === 'message'){
                this._message(data.from.name, data.message, data.timestamp);
            }
            if(data.type === 'file'){
                this._messageFile(data.from.name, data.message, data.timestamp);
            }
        };

        this.ws.onerror = (e) => {
            if(e.message == "Expected HTTP 101 response but was '502 Bad Gateway'"){
                Toast.show({
                    text: 'Сервис временно не доступен!',
                    buttonText: 'Ok',
                    type: 'danger',
                });
                this.props.navigation.goBack();
            }
        };

        this.ws.onclose = (e) => {
            if(e.code !== 1000) {
                Toast.show({
                    text: 'Ошибка! Сервис был остановлен!',
                    buttonText: 'Ok',
                    type: 'danger',
                });
                this.props.navigation.goBack();
            }
        };
    }

    _getListMessage = async (room, name) => {
        const API_URL = `${API}backend/chat/messages?room=${room}`;

        try{
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': this.state.token,
                },
            });

            const responseJson = await response.json();
            responseJson.result.map((item) => {
                let pos = (item.idpos == 0) ? false : true;
                let isfile = (item.isfile == 0) ? false : true;
                let text = (item.isfile == 0) ? item.msg : JSON.parse(item.msg);

                let msgText = {
                    name: item.username,
                    text: text,
                    datetime: item.date_set,
                    pos: pos,
                    file: isfile
                };

                this.setState({message: [...this.state.message, msgText]});
            });
        }catch (error) {
            Toast.show({
                text: 'Ошибка загрузки списка сообщений!',
                buttonText: 'Ok',
                type: 'danger',
            });
        }
        this.setState({refreshing: false});
    }

    _refreshPage = () => {
        this.setState({refreshing: true});
        this._getUserData();
        this._getToken();
        this._getListMessage(this.props.route.params.roomUrl, this.state.user.fname+' '+this.state.user.lname);
    }

    UNSAFE_componentWillMount() {
        this._refreshPage();
    }

    //------------------------
    _typingUser = (name) => {
        this.setState({ typingUser: name, typingText: 'набирает сообщение...' });
    }
    _unTypingUser = () => {
        this.setState({ typingUser: '', typingText: '' });
    }
    _userDisconected = (name) => {
        Toast.show({
            text: name+' отключился',
            buttonText: 'Ok',
            type: 'warning',
        });
        let cnt = this.state.countUsers -1;
        this.setState({ typingUser: '', typingText: '', countUsers: cnt });
    }

    _userConnected = (name) => {
        let cnt = this.state.countUsers +1;
        this.setState({countUsers: cnt});
        Toast.show({
            text: name+' подключился',
            buttonText: 'Ok',
            type: 'success',
        });
        if(!this.state.chatUsers[name]){
            this.setState({chatUsers: [...this.state.chatUsers, name]});
        }
    }

    _listUsers = (array) => {
        let users = [];
        array.map((item) => {
            if(!this.state.chatUsers[item.name]){
                users.push(item.name);
            }
        });
        this.setState({chatUsers: [...this.state.chatUsers, users]});
        this.setState({countUsers: users.length});
    }

    _message = (name, messageText, datetime) => {
        if(messageText.trim() !== '') {
            let pos = true;
            if (name == this.state.user.fname + ' ' + this.state.user.lname) {
                pos = false;
            }else{
                Vibration.vibrate()
            }
            let msgText = {
                name: name,
                text: messageText,
                datetime: moment.utc(datetime*1000).format("DD.MM.YYYY HH:mm"),
                pos: pos,
                file: false
            };
            this.setState({message: [...this.state.message, msgText]});
        }
    }
    _messageFile = (name, filename, datetime) => {
        let pos = true;
        if (name == this.state.user.fname + ' ' + this.state.user.lname) {
            pos = false;
        }
        let msgText = {
            name: name,
            text: JSON.parse(filename),
            datetime: moment.utc(datetime*1000).format("DD.MM.YYYY HH:mm"),
            pos: pos,
            file: true
        };
        this.setState({message: [...this.state.message, msgText]});
    }

    _changeMessageInput = (text) => {
        this.setState({ msgText: text });
        if(text.length > 0) {
            let params = JSON.stringify( {'action': 'start-typing'});
            this.ws.send(params);
        }else{
            let params = JSON.stringify( {'action': 'stop-typing'});
            this.ws.send(params);
        }
    }
    _sendMessage = () => {
        let text = this.state.msgText;
        let params = JSON.stringify({
            'message': text,
            'action': 'message'
        });
        this.ws.send(params);
        this.setState({ msgText: '' });
    }

    _pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({type: "*/*"});
        if (result.type == "cancel") {
            return;
        }

        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);

        let type_file = fileTypes(match[1]);

        let formData = new FormData();
        formData.append('filename', { uri: localUri, name: filename, type: type_file });

        let room = this.state.room;
        const API_URL = `${API}backend/savefile?room=${room}`;

        try{
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            });

            const responseJson = await response.json();
            let params = JSON.stringify({
                'message': JSON.stringify(responseJson.result.files),
                'action': 'file'
            });
            this.ws.send(params);

        }catch (error) {
            Toast.show({
                text: 'Ошибка загрузки файла. Максимальный размер 50 мб ',
                buttonText: 'Ok',
                type: 'danger',
            });
        }
    }

    _showVideoChat = () => {
        let url = 'https://rtc-srv.bmcudp.kz:8443/'+this.state.room;
        Linking.openURL(url);
    }

    //------------------------
    render() {
        return (
            <Container>
                <Header style={styles.headerTop}>
                    <Left style={{flex: 0.7}}>
                        <Ionicons
                            name="md-arrow-back"
                            style={{color: '#046475', marginLeft: 10}}
                            onPress={() => this.props.navigation.goBack()}
                            size={24}
                        />
                    </Left>
                    <Body style={{flex: 3}}>
                        <Title style={{color: '#046475', fontSize: 20}}>
                            Онлайн консультация
                        </Title>
                    </Body>
                    <Right>
                        <FontAwesome
                            name="video-camera"
                            size={24}
                            style={{marginRight: 10}}
                            color="#046475"
                            onPress={this._showVideoChat}
                        />
                    </Right>
                </Header>
                <Content>
                {this.state.refreshing ? (
                    <Text style={{ textAlign: "center", fontSize: 14, flex: 1, marginTop: 20, width: '100%' }}>Подождите идет загрузка данных</Text>
                ) : (
                    <List>
                        <ListItem style={{
                            height: this.state.wh.height-140,
                        }}>
                            <ScrollView
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    justifyContent: "flex-end",
                                    width: this.state.wh.width
                                }}
                                scrollEnabled={true}
                                style={{flex: 2, zIndex: 1000}}
                                ref={ref => scrollView = ref}
                                onContentSizeChange={() => scrollView.scrollToEnd({ animated: true })}
                            >
                                {
                                    this.state.message.map((item) => (
                                        <View
                                            style={styles.messageBlock}
                                        >
                                            <Text style={item.pos ? styles.messageLeftTextHead : styles.messageRightTextHead}>
                                                <Text style={styles.messageUsername}>{item.name}</Text> <Text style={styles.messageTime}>({item.datetime})</Text>
                                            </Text>
                                            <View
                                                style={item.pos ? styles.messageLeftBody : styles.messageRightBody}
                                            >
                                                {item.file ? (
                                                    <TouchableOpacity
                                                        style={{ flex: 1, flexDirection: "row"}}
                                                        onPress={() => {
                                                            Linking.openURL(`${API}${item.text.url_path}`);
                                                        }}
                                                    >
                                                        <AntDesign name="save" size={50} color="black" style={{  justifyContent: "flex-start", marginRight: 10 }} />
                                                        <Text style={{ justifyContent: "flex-end", marginTop: 10, fontSize: 14, width: '80%' }} >{item.text.name}</Text>
                                                    </TouchableOpacity>
                                                ):(
                                                    <Text>{item.text}</Text>
                                                )}
                                            </View>
                                        </View>
                                    ))
                                }

                            </ScrollView>
                            {this.state.typingUser !== '' ? (
                                <Text style={styles.textTyping} >{this.state.typingUser} {this.state.typingText}</Text>
                            ) : (
                                <Text style={{ display: "none" }}></Text>
                            )}
                        </ListItem>
                    </List>
                )}
                </Content>
                <Footer style={{
                    backgroundColor: "#fff"
                }}>

                        <TouchableOpacity
                            style={styles.btnSendFile}
                            onPress={this._pickDocument}
                        >
                            <MaterialIcons name="attach-file" size={24} color="black" />
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputMessage}
                            placeholder="Введите текст сообщения..."
                            value={this.state.msgText}
                            onChangeText={(text) => this._changeMessageInput(text)}
                            multiline={true}
                            ref={input => { this.textInput = input }}
                        />
                        <TouchableOpacity
                            style={styles.btnSendMessage}
                            onPress={this._sendMessage}
                        >
                            <Ionicons name="ios-send" size={24} color="black" />
                        </TouchableOpacity>

                </Footer>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerTop: {
        backgroundColor: '#01A19F',
    },
    footer: {
        position: "absolute",
        left: 0,
        bottom: 0,
    },
    inputMessage: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#d4d4d4',
        borderRadius: 30,
        height: 50,
        width: '80%',
        backgroundColor: '#fff',
        padding: 10,
        paddingLeft: 50,
    },
    btnSendMessage: {
        backgroundColor: '#d4d4d4',
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#d4d4d4',
        borderRadius: 30,
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    btnSendFile: {
        backgroundColor: '#d4d4d4',
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: '#d4d4d4',
        borderRadius: 30,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        left: 15,
        top: 5,
        zIndex: 2,
    },

    messageBlock: {
        marginBottom: 15,
    },

    messageLeftTextHead: {
        fontSize: 10,
        textAlign: "left",
        marginLeft: 5
    },
    messageLeftBody: {
        maxWidth: '80%',
        marginLeft: 5,
        marginTop: 5,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 5,
        backgroundColor: "#ffffff"
    },

    messageRightTextHead: {
        fontSize: 10,
        textAlign: "right",
        paddingRight: 50
    },
    messageRightBody: {
        width: '80%',
        marginLeft: '10%',
        marginTop: 5,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: 5,
        backgroundColor: "#b7e9fc",
    },

    textTyping: {
        position: "absolute",
        bottom: 0,
        left: 20,
        width: '90%',
        padding: 5,
        textAlign: "center",
        backgroundColor: '#fce7d4',
        borderRadius: 30,
        fontSize: 10,
        color: '#5f5f5f',
        fontStyle: "italic"
    },

    messageUsername: {
        fontSize: 14,
        fontStyle: "italic"
    },
    messageTime: {
        color: '#b8b8b8',
        fontSize: 10,
    },
});


export default PriemChat;