import Expo from 'expo';
import {
  Dimensions,
  Container,
  Content,
  Header,
  Left,
  Button,
  Right,
  Icon,
  FooterTab,
  Footer,
  Body,
  Title,
  Item,
  Input,
  Form,
  Picker,
  Spinner,
  Toast,
} from 'native-base';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  StatusBar,
  Platform,
  AsyncStorage,
  Alert,
  ImageBackground,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { API, getToken } from '../constants';

class ChooseTime extends React.Component {
  state = {
    isDateTimePickerVisible: false,
    date: '',
    selectedDoctor: -1,
    shed_id: '',
    doctorName: '',
    doctorId: '',
    spec_cod: '',
    token: '',
    listTime: [],
    loading: false,
    loadingFont: true,
  };

  _showDatePicker = () => this.setState({ isDatePickerVisible: true });

  _hideDatePicker = () => this.setState({ isDateTimePickerVisible: false });

  onTimeChange = (value: string) => {
    this.setState({
      shed_id: value,
    });
  };

  _getToken = async () => {
    try {
      await getToken().then(itoken => {
        this.setState({ token: itoken });
      });

    } catch (error) {
      console.log('error get Token' + error);
    }
  };

  _postTalon = async () => {
    const shed_id = this.state.shed_id;

    if (shed_id) {
      try {
        const API_URL = `${API}backend/ambTalonReceptionSave`;
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            token: this.state.token,
          },
          body: `h=ast2&i=${shed_id}`,
        });

        const responseJson = await response.json();
        if (responseJson !== null) {
          var data = responseJson;
          if (data.success) {
            Toast.show({
              text: 'Успешно записались! ' + data.message,
              buttonText: 'Ok',
              type: 'success',
              duration: 7000,
            });
            this.props.navigation.navigate('Home');
          } else {
            Toast.show({ type: 'danger', text: data.message });
          }
        }
      } catch (error) {
        console.log('Error when call API (onLogin): ' + error.message);
      }
    } else {
      Toast.show({
        text: 'Выберите время',
        buttonText: 'Ok',
        type: 'warning',
        duration: 3000,
      });
    }
  };

  _getSheduleDay = async () => {
    const { doctorId, cabinet, date } = this.state;
    try {
      const API_URL = `${API}backend/getSheduleDay?h=ast2&d=-2&doc=${doctorId}&day=${date}&c=${cabinet}`;
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          token: this.state.token,
        },
      });
      const responseJson = await response.json();
      if (responseJson !== null) {
        var data = responseJson;
        if (data) {
          const res = data.filter((item) => item.flag === 0);

          if (res.length !== 0) {
            this.setState({ listTime: res });
          } else {
            Toast.show({
              text: 'В данной дате нет свободного времени',
              buttonText: 'Ok',
              type: 'warning',
              duration: 3000,
            });
          }
        } else {
          console.log('Ошибка! Попробуйте еще раз');
        }
      }
    } catch (error) {
      console.log('Error when call API _getSheduleDay: ' + error.message);
    }
    this.setState({ loading: false });
  };

  onPressBtnSave = () => {
    if (this.state.date) {
      this._postTalon();
    } else {
      Toast.show({
        text: 'Выберите дату приема',
        buttonText: 'Ok',
        type: 'warning',
        duration: 3000,
      });
    }
  };

  _handleDatePicked = (date) => {
    this.setState({
      date: '' + date.toISOString().substring(0, 10),
      isDatePickerVisible: false,
      loading: true,
    });
    this._getSheduleDay();
  };

  render() {
    const dataIncome = this.props.navigation.getParam('data', []);
    return (
      <Container>
        <ImageBackground
          source={require('../../assets/design/priem.png')}
          style={{ width: '100%', height: '100%' }}>
          <Header style={styles.headerTop}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body style={{ flex: 3 }}>
              <Title>Записаться на прием </Title>
            </Body>
            <Right />
          </Header>

          <Content padder>
            {this.state.loading ? (
              <Spinner color="red" />
            ) : (
              <Form>
                <Item>
                  <Button iconLeft transparent primary>
                    <Icon
                      name="checkmark-circle"
                      style={{
                        color: '#5b7ea4',
                        fontSize: 20,
                        paddingRight: 10,
                      }}
                    />
                    <Text> {this.state.doctorName}</Text>
                  </Button>
                </Item>
                <Item>
                  <Input value={this.state.date} placeholder="Выберите дату" />
                  <Icon active name="calendar" onPress={this._showDatePicker} />
                </Item>
                <Item style={{ paddingVertical: 5 }}>
                  <Text style={{ fontSize: 14 }}>Выберите время</Text>
                  <Picker
                    note
                    mode="dropdown"
                    style={{ width: 120 }}
                    selectedValue={this.state.shed_id}
                    onValueChange={this.onTimeChange}>
                    {this.state.listTime.map((item, i) => (
                      <Picker.Item
                        key={i}
                        label={item.shedul_time}
                        value={item.shed_id}
                      />
                    ))}
                  </Picker>
                </Item>
                <Button
                  block
                  style={{ backgroundColor: '#5b7ea4' }}
                  onPress={this.onPressBtnSave}>
                  <Text style={{ color: 'white' }}>ЗАПИСАТЬСЯ</Text>
                </Button>
              </Form>
            )}
            <DateTimePicker
              isVisible={this.state.isDatePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDatePicker}
              mode="date"
            />
          </Content>
          <Footer style={{ backgroundColor: '#5b7ea4' }}>
            <FooterTab style={{ backgroundColor: '#5b7ea4' }}></FooterTab>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }

  componentDidMount() {
    const dataIncome = this.props.navigation.getParam('data', []);
    this._getToken().done();
    this.setState({
      doctorName: dataIncome['doctorName'],
      doctorId: dataIncome['doctorId'],
      spec_code: dataIncome['spec_code'],
      cabinet: dataIncome['cabinet'],
    });
  }

  async UNSAFE_componentWillMount() {
    this.setState({ loadingFont: false });
  }
}

export default ChooseTime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTop: {
    backgroundColor: '#5b7ea4',
  },
  rowBottom: {
    zIndex: 1,
    marginTop: -40,
  },
});
