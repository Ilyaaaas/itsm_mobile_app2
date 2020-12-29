import React from "react";
import {ActivityIndicator, Modal, Text, TouchableOpacity, View} from "react-native";
import {Body, Button, Container, Left, List, ListItem, Right, Toast} from "native-base";
import moment from "moment";
import {Head} from'./Head';
import { API, getToken } from '../constants';
import WebView from "react-native-webview";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import DatePicker from 'react-native-datepicker';


const dateNow = moment().add(-1, 'years').format('DD.MM.YYYY');
//const dateNow = new Date(m);

export default class PassportExtracts extends React.Component<any, any>{
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            dateBegin: dateNow,
            dateEnd: moment().format('DD.MM.YYYY'),
            list: [],
            showModal: false,
            html: '',
            onFilter: false,
        }
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
            this.setState({
                list: result,
                onFilter: false,
            });
        })
    }

    _getFilter = async () => {
        if(this.state.dateBegin == null){
            return;
        }

        if(this.state.dateEnd == null){
            return;
        }

        //let date_begin = moment(this.state.dateBegin).format('DD.MM.YYYY');
        //let date_end = moment(this.state.dateEnd).format('DD.MM.YYYY');

        let date_begin = this.state.dateBegin;
        let date_end = this.state.dateEnd;
        await this._getUrl('get_protocols?date_begin='+date_begin+'&date_end='+date_end).then(result => {
            if(result == null){
                this.setState({list: [], onFilter: true});
            }else {
                this.setState({list: result, onFilter: true});
            }
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
                                showIcon={false}
                                androidMode="spinner"
                                style={{ width: '100%' }}
                                date={this.state.dateBegin}
                                mode="date"
                                placeholder="DD.MM.YYYY"
                                format="DD.MM.YYYY"
                                maxDate={moment().format('DD.MM.YYYY')}
                                confirmBtnText="Ok"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateInput: {
                                        backgroundColor: 'white',
                                        borderWidth: 0,
                                        borderColor: 'black',
                                    },
                                }}
                                onDateChange={(date) => {
                                    this.setState({ dateBegin: date });
                                }}
                            />
                        </Left>
                        <Body>
                            <DatePicker
                                showIcon={false}
                                androidMode="spinner"
                                style={{ width: '100%' }}
                                date={this.state.dateEnd}
                                mode="date"
                                placeholder="DD.MM.YYYY"
                                format="DD.MM.YYYY"
                                maxDate={moment().format('DD.MM.YYYY')}
                                confirmBtnText="Ok"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateInput: {
                                        backgroundColor: 'white',
                                        borderWidth: 0,
                                        borderColor: 'black',
                                    },
                                }}
                                onDateChange={(date) => {
                                    this.setState({ dateEnd: date });
                                }}
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