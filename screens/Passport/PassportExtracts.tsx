import React from "react";
import {ActivityIndicator, DatePickerIOS, Modal, Text, TouchableOpacity, View} from "react-native";
import {Body, Button, Container, DatePicker, Left, List, ListItem, Right, Toast} from "native-base";
import moment from "moment";

import {Head} from'./Head';
import { API, getToken } from '../constants';
import WebView from "react-native-webview";
import DateTimePicker from "react-native-modal-datetime-picker";
import {AntDesign, Ionicons} from "@expo/vector-icons";

export default class PassportExtracts extends React.Component<any, any>{
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            dateBegin: null,
            dateEnd: new Date(),
            defaultDate: new Date(),
            list: [],
            showModal: false,
            html: '',
            onFilter: false,
        }

        this.setDateBegin = this.setDateBegin.bind(this);
        this.setDateEnd = this.setDateEnd.bind(this);
    }

    setDateBegin(newDate) {
        this.setState({ dateBegin: newDate });
    }

    setDateEnd(newDate) {
        this.setState({ dateEnd: newDate });
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
                    return null;
                }
                return responseJson.result;
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }
        return null;
    }

    _get_protocols = async () => {
        await this._getUrl('get_protocols').then(result => {
            this.setState({list: result, onFilter: false});
        })
    }

    _getFilter = async () => {
        if(this.state.dateBegin == null){
            return;
        }

        if(this.state.dateEnd == null){
            return;
        }

        let date_begin = moment(this.state.dateBegin).format('DD.MM.YYYY');
        let date_end = moment(this.state.dateEnd).format('DD.MM.YYYY');

        await this._getUrl('get_protocols?date_begin='+date_begin+'&date_end='+date_end).then(result => {
            console.log(result);
            this.setState({list: result, onFilter: true});
        })
    }

    _getHtml = async (id) => {
        await this._getUrl('get_protocols_html/'+id).then(result => {
            this.setState({ html: result, showModal: true});
        })
    }

    componentDidMount = async () => {
        await this._getToken();
        await this._get_protocols();
    }

    LoadingIndicatorView = () => {
        return <ActivityIndicator color='#009b88' size='large' />
    }

    render() {
        return (
            <Head
                title={'Выписки'}
                onBack={true}
                props={this.props}
            >
                <List>
                    <ListItem noBorder style={{ marginBottom: -30 }}>
                        <Text style={{ width: '100%', textAlign: "center" }}>Выберите период</Text>
                    </ListItem>
                    <ListItem>
                        <Left>
                            <DatePicker
                                defaultDate={this.state.defaultDate}
                                onDateChange={this.setDateBegin}
                            />
                        </Left>
                        <Body>
                            <DatePicker
                                defaultDate={this.state.defaultDate}
                                onDateChange={this.setDateEnd}
                            />
                        </Body>
                        <Right>
                            {this.state.onFilter ? (
                                <TouchableOpacity onPress={() => {
                                    this._get_protocols()
                                }}>
                                    <Ionicons name="ios-close-circle" size={24} color="black" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => {
                                    this._getFilter()
                                }}>
                                    <AntDesign name="filter" size={24} color="black" />
                                </TouchableOpacity>
                            )}

                        </Right>
                    </ListItem>
                    {this.state.list.map((value, i) => (
                        <ListItem
                            key={i}
                            style={{ paddingBottom: 5, paddingTop: 5 }}
                            onPress={() => { this._getHtml(value.id) }}
                        >
                            <Text style={{ fontSize: 14, marginTop: 10, marginBottom: 10 }}>Выписка от { value.prot_date }</Text>
                        </ListItem>
                    ))}
                </List>
                <Modal visible={this.state.showModal}>
                    <Container>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 8 }}>
                                <WebView
                                    originWhitelist={['*']}
                                    source={{ html: this.state.html }}
                                    style={{ height: '90%' }}
                                    renderLoading={this.LoadingIndicatorView}
                                    startInLoadingState={true}
                                />
                            </View>
                            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                                <Button
                                    onPress={() => {this.setState({showModal: false})}}
                                    style={{ width: '100%', borderRadius: 5 }}
                                >
                                    <Text style={{ width: '100%', textAlign: "center" }}>Закрыть</Text>
                                </Button>
                            </View>
                        </View>
                    </Container>
                </Modal>
            </Head>
        );
    }
}