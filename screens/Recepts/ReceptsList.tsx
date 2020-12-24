import React from "react";
import {Head} from "../Passport/Head";
import {Text, View} from "react-native";
import {Body, Left, List, ListItem, Toast} from "native-base";
import {API, getToken} from '../constants';
import {FontAwesome5} from "@expo/vector-icons";
import moment from "moment";
import {Button} from "react-native-paper";
import * as _ from 'lodash';

export default class ReceptsList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            list: [],
            loading: false,
            sortBy: 'desc',
        }
    }
    _getToken = async ()=> {
        await getToken().then(itoken => {
            this.setState({token: itoken});
        })
    }

    _getUrl = async (url) => {
        const API_URL = `${API}backend/${url}`;
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
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

    _getList = async () => {
        this._getUrl('get_recepts').then(ilist => {
            if(ilist !== null) {
                this.setState({list: ilist});
            }
        })
    }

    componentDidMount = async () => {
         await this._getToken();
         await this._getList();
    }

    getSorted = ({list}: { list: any }) => {
        const sortedList = _.sortBy(list, (a) =>
            moment(a.recept_date, 'DD.MM.YYYY')
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

    render() {
        return (
            <Head
                title={'Рецепты'}
                props={this.props}
            >
                <List>
                    <ListItem>
                        <Button
                            icon={
                                this.state.sortBy === 'desc' ? 'chevron-down' : 'chevron-up'
                            }
                            onPress={this.handleSortBy}>
                            Сортировать по дате
                        </Button>
                    </ListItem>

                    {this.state.list.map((value, i) => (
                        <ListItem key={i}>
                            <Left>
                                <FontAwesome5 name="notes-medical" size={24} color="black" />
                            </Left>
                            <Body style={{ flex: 7}}>
                                <View>
                                    <Text>{value.recept_num}</Text>
                                </View>
                                <View>
                                    <Text>{value.doctor}</Text>
                                </View>
                                <View>
                                    <Text style={{ fontSize: 10 }}>{value.recept_date}</Text>
                                </View>
                            </Body>
                        </ListItem>
                    ))}
                </List>
            </Head>
        );
    }
}