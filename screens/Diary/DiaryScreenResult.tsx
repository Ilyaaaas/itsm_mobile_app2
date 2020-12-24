import React from "react";
import {Container, Content, Left, List, ListItem, Body, Title, Header, Input, Right, Button, Toast} from "native-base";
import {Entypo, Ionicons} from "@expo/vector-icons";
import {StyleSheet, Text} from "react-native";
import { API, getToken } from '../constants';

class DiaryScreenResult extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            list : {},
            body_color: '#fff',
            token: ''
        }
    }

    componentDidMount = async () => {
        await this.setState({list: this.props.route.params.list});
        let bm = parseFloat(this.state.list.body_mass);
        if(bm <= 16){
            this.setState({body_color: '#ff5a00'});
        }

        if(bm > 16 && bm <= 18.5){
            this.setState({body_color: '#ffed7e'});
        }

        if(bm > 18.5 && bm <= 25){
            this.setState({body_color: '#8fff7b'});
        }

        if(bm > 25 && bm <= 30){
            this.setState({body_color: '#7bbbff'});
        }

        if(bm > 30 && bm <= 35){
            this.setState({body_color: '#cc7bff'});
        }

        if(bm > 35 && bm <= 40){
            this.setState({body_color: '#fc8c8c'});
        }

        if(bm > 40){
            this.setState({body_color: '#ff0000'});
        }
    }

    _getToken = async () => {
        await getToken().then(itoken => {
            this.setState({token: itoken})
        });
    }

    _trash = async () => {
        const API_URL = `${API}backend/diary_trash`;
        await this._getToken();

        try{
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': this.state.token,
                },
                body: `id=${this.state.list.id}`
            });

            const responseJson = await response.json();

            if (responseJson !== null) {
                let itype = 'success';
                if(responseJson.success === false){
                    itype = 'danger';
                }

                Toast.show({
                    text: responseJson.message,
                    type: itype,
                    duration: 3000
                });

                this.props.navigation.navigate('DiaryScreen', {
                    refreshing: true
                });
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }

    }

    render() {
        return (
            <Container>
                <Header style={styles.headerTop}>
                    <Left style={{ flex: 1}}>
                        <Ionicons name="md-arrow-back"
                                  style={{ color: '#046475', marginLeft: 10 }}
                                  onPress={() => this.props.navigation.goBack()}
                                  size={24}
                        />
                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: '#046475' }}>Запись наблюдения</Title>
                    </Body>
                    <Right>
                        <Entypo name="trash"
                                size={24}
                                color="#046475"
                                style={{ marginRight: 10}}
                                onPress={() => {
                                    this._trash();
                                }}
                        />
                    </Right>
                </Header>
                <Content>
                    <List>
                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Рост (см)</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.growth}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Вес (кг)</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.weight}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Индекс массы тела</Text>
                            </Left>
                            <Body style={{ backgroundColor: this.state.body_color }}>
                                <Text>{this.state.list.body_mass}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Артериальное давление</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.blood_pressure}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Уровень сахара в крови</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.blood_sugar}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Уровень холестирина</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.cholesterol}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Чистота сердечных сокращений</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.chss}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Частота дыхательных движений</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.chdd}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Сатурация при наличии</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.saturation}</Text>
                            </Body>
                        </ListItem>

                        <ListItem itemHeader style={{ paddingTop: 1, height: 10, backgroundColor: '#01A19F' }}>
                            <Text style={styles.title}>Физическая активность</Text>
                        </ListItem>
                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Шагов в день</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.activity_steps}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Умеренная мин/день</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.activity_moderate}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Интенсивная мин/день</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.activity_intense}</Text>
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left style={{ flex: 4}}>
                                <Text>Потребление чистой воды (литров в день)</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.consuption_water}</Text>
                            </Body>
                        </ListItem>


                        <ListItem itemHeader style={{ paddingTop: 1, height: 10, backgroundColor: '#01A19F' }}>
                            <Text style={styles.title}>Потребление табака</Text>
                        </ListItem>
                        <ListItem>
                            <Left style={{ flex: 4}}>
                                <Text>Сигарет в день</Text>
                            </Left>
                            <Body>
                                <Text>{this.state.list.tobacco_sigarets}</Text>
                            </Body>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem>
                            <Button style={{ width: '100%', borderRadius: 10 }}
                                    onPress={() => {
                                        this.props.navigation.navigate('DiaryScreenView', {
                                            id: this.state.list.id
                                        });
                                    }}
                            >
                                <Text style={{ width: '100%', textAlign: "center", color: '#fff' }}>Редактировать</Text>
                            </Button>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        )
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
    input: {
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
    },
    title: {
        marginTop: 25,
        textAlign: "center",
        width: '100%'
    }
})

export default DiaryScreenResult;