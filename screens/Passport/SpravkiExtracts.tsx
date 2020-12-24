import React from "react";
import {Body, Left, List, ListItem, Right, Toast} from "native-base";
import { API, getToken } from '../constants';
import {Head} from "./Head";
import {Linking, Text} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';

export default class SpravkiExtracts extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            list: []
        }
    }

    _getToken = async () => {
        await getToken().then(itoken => {
            this.setState({token: itoken});
        })
    }

    _get_list = async () => {
        await this._getUrl('spr_list').then(res => {
            this.setState({list: res});
        });
    }

    componentDidMount = async () => {
        await this._getToken();
        await this._get_list();
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

    pressDownloadPDF = async (card_id, type) => {
        const url = `${API}backend/spr_download?type=${type}&card_id=${card_id}&token=${this.state.token}`;
        await Linking.openURL(url);
    };

    render() {
        return (
            <Head
                title={'Справки'}
                onBack={true}
                props={this.props}
            >
                <List>
                    {this.state.list.map((value, i) => (
                        <ListItem
                            key={i}
                            style={{ paddingBottom: 5, paddingTop: 5 }}
                            onPress={() => { this.pressDownloadPDF(value.card_id, value.type_spr) }}
                        >
                            <Left style={{ flex: 1 }}>
                                <FontAwesome5 name="file-medical" size={24} color="black" />
                            </Left>
                            <Body style={{ flex: 9 }}>
                                <Text style={{ fontSize: 14, marginTop: 10, marginBottom: 10 }}>{ value.title }</Text>
                                <Text style={{ fontSize: 10, color: '#a1a1a1' }}>{ value.close_date }</Text>
                            </Body>
                        </ListItem>
                    ))}
                </List>
            </Head>
        );
    }
}