import React from "react";
import {
    Body,
    Container,
    Content,
    Header,
    Left,
    List,
    Right,
    Title,
    ListItem,
    Toast,
    Input,
    Item,
    Button
} from "native-base";
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import moment from "moment";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import {API, getToken} from '../constants';
import {white} from "react-native-paper/lib/typescript/src/styles/colors";

class DiaryScreenView extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            id: 0,

            growth: '',
            weight: '',
            blood_pressure: '',
            blood_sugar: '',
            cholesterol: '',
            chss: '',
            chdd: '',
            saturation: '',
            activity_steps: '',
            activity_moderate: '',
            activity_intense: '',
            consuption_water: '',
            tobacco_sigarets: ''
        }
    }

    _getDiary = async () => {
        if(parseInt(this.state.id) === 0){
            return;
        }
        await this._getToken();
        const API_URL = `${API}backend/diary?id=${this.state.id}`;

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
                let res = responseJson.result;
                this.setState({
                    growth: res.growth,
                    weight: res.weight,
                    blood_pressure: res.blood_pressure,
                    blood_sugar: res.blood_sugar,
                    cholesterol: res.cholesterol,
                    chss: res.chss,
                    chdd: res.chdd,
                    saturation: res.saturation,
                    activity_steps: res.activity_steps,
                    activity_moderate: res.activity_moderate,
                    activity_intense: res.activity_intense,
                    consuption_water: res.consuption_water,
                    tobacco_sigarets: res.tobacco_sigarets,
                });
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }
    }

    _getToken = async () => {
        await getToken().then(itoken => {
            this.setState({token: itoken});
        })
    }

    _save = async () => {
        if(this.state.token == ''){
            await this._getToken();
        }

        const API_URL = `${API}backend/save_diary`;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'token' : this.state.token,
            },
            body: `id=${this.state.id}&growth=${this.state.growth}&weight=${this.state.weight}&blood_pressure=${this.state.blood_pressure}&blood_sugar=${this.state.blood_sugar}&cholesterol=${this.state.cholesterol}&chss=${this.state.chss}&chdd=${this.state.chdd}&saturation=${this.state.saturation}&activity_steps=${this.state.activity_steps}&activity_moderate=${this.state.activity_moderate}&activity_intense=${this.state.activity_intense}&consuption_water=${this.state.consuption_water}&tobacco_sigarets=${this.state.tobacco_sigarets}`,
        });

        const responseJson = await response.json();

        if (responseJson !== null) {
            let itype = 'success'
            if(responseJson.success == false){
                itype = 'danger';
            }
            Toast.show({
                text: responseJson.message,
                type: itype,
                buttonText: 'Ok',
                duration: 3000,
            });
            this.props.navigation.navigate('DiaryScreen', {
                refreshing: true
            });
        }
        return;
    }

    componentDidMount = async () => {
        await this.setState({id: this.props.route.params.id});
        this._getDiary();
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
                        <Title style={{ color: '#046475' }}>Внесение данных</Title>
                    </Body>
                </Header>

                <Content>
                    <List>

                        <ListItem noBorder>
                            <Left>
                                <Text>Рост (см)</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.growth}
                                       onChangeText={(value) => this.setState({growth: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Вес (кг)</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.weight}
                                       onChangeText={(value) => this.setState({weight: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Артериальное давление</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.blood_pressure}
                                       onChangeText={(value) => this.setState({blood_pressure: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Уровень сахара в крови</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.blood_sugar}
                                       onChangeText={(value) => this.setState({blood_sugar: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Уровень холестирина</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.cholesterol}
                                       onChangeText={(value) => this.setState({cholesterol: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Чистота сердечных сокращений</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.chss}
                                       onChangeText={(value) => this.setState({chss: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Частота дыхательных движений</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.chdd}
                                       onChangeText={(value) => this.setState({chdd: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Сатурация при наличии</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.saturation}
                                       onChangeText={(value) => this.setState({saturation: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem itemHeader style={{ paddingTop: 1, height: 10, backgroundColor: '#01A19F' }}>
                            <Text style={styles.title}>Физическая активность</Text>
                        </ListItem>
                        <ListItem noBorder>
                            <Left>
                                <Text>Шагов в день</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.activity_steps}
                                       onChangeText={(value) => this.setState({activity_steps: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Умеренная мин/день</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.activity_moderate}
                                       onChangeText={(value) => this.setState({activity_moderate: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Интенсивная мин/день</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.activity_intense}
                                       onChangeText={(value) => this.setState({activity_intense: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Left>
                                <Text>Потребление чистой воды (литров в день)</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.consuption_water}
                                       onChangeText={(value) => this.setState({consuption_water: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>


                        <ListItem itemHeader style={{ paddingTop: 1, height: 10, backgroundColor: '#01A19F' }}>
                            <Text style={styles.title}>Потребление табака</Text>
                        </ListItem>
                        <ListItem>
                            <Left>
                                <Text>Сигарет в день</Text>
                            </Left>
                            <Body>
                                <Input value={this.state.tobacco_sigarets}
                                       onChangeText={(value) => this.setState({tobacco_sigarets: value}) }
                                       keyboardType="numeric"
                                       style={styles.input}
                                       placeholder={'0'}
                                />
                            </Body>
                        </ListItem>

                        <ListItem noBorder>
                            <Button
                                style={{ width: '100%', borderRadius: 10 }}
                                onPress={() => {this._save()}}
                            >
                                <Text style={{ textAlign: "center", width: '100%', color: 'white' }}>Сохранить</Text>
                            </Button>
                        </ListItem>

                    </List>
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

export default DiaryScreenView;