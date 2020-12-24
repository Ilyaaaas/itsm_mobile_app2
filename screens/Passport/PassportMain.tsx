import React from "react";
import {Body, Left, List, ListItem} from "native-base";
import {Text} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";

import { Head } from "./Head";


class PassportMain extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Head
                title={'Паспорт здоровья'}
                props={this.props}
            >
                <ListItem onPress={() => {
                    this.props.navigation.navigate('PassportExtracts');
                }}>
                    <Left>
                        <FontAwesome5 name="book-medical" size={24} color="black" />
                    </Left>
                    <Body style={{ flex: 6}}>
                        <Text style={{ fontSize: 20 }}>Выписки</Text>
                    </Body>
                </ListItem>

                <ListItem onPress={() => {
                    this.props.navigation.navigate('SpravkiExtracts');
                }}>
                    <Left>
                        <FontAwesome5 name="book-medical" size={24} color="black" />
                    </Left>
                    <Body style={{ flex: 6}}>
                        <Text style={{ fontSize: 20 }}>Справки</Text>
                    </Body>
                </ListItem>
            </Head>
        );
    }
}

export default PassportMain;