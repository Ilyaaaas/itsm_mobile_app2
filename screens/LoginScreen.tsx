import {
  Container,
  Content,
  Header,
  Button,
  FooterTab,
  Footer,
  Spinner,
  Item,
  Input,
  Form,
  Toast,
} from 'native-base';
import React from 'react';
import { Text, View, AsyncStorage, ImageBackground, KeyboardAvoidingView } from 'react-native';

import Main from './Main';
import { API } from './constants';

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      isLoggedIn: false,
      message: '',
      token: '',
      loading: false,
      loadingFont: true,
    };
  }

  onLogin = async () => {
    const { username, password } = this.state;
    //let username = '00000005';
    //let password = '97755721';
    if (username && password) {
      try {
        this.setState({ loading: true });
        const API_URL = `${API}backend/login`;

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `login=${username}&password=${password}`, //JSON.stringify({'login': username, 'password': password}),
        });

        const responseJson = await response.json();
        if (responseJson !== null) {
          const data = responseJson;
          if (data.success) {
            this._storeData('token', data.sessionId);
            this.setState({ token: data.sessionId });
            this._getUserData(data.sessionId);
          } else {
            Toast.show({
              text: 'Ошибка: Неправильный логин или пароль',
              buttonText: 'Ok',
              type: 'danger',
              duration: 3000,
            });
          }
        }
      } catch (error) {
        console.log('Error when call API (onLogin): ' + error.message);
      }
    } else {
      Toast.show({
        text: 'Заполните логин и пароль',
        buttonText: 'Ok',
        type: 'warning',
        duration: 3000,
      });
    }
  };

  _getUserData = async (token) => {
    try {
      const API_URL = `${API}backend/getUserData?h=ast2`;

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          token: this.state.token,
        },
      });
      let responseJson;
      await response.json().then(function (parsedData) {
        responseJson = parsedData;
      });

      if (responseJson !== null) {
        var data = responseJson;
        if (data) {
          this._storeData('user_data', data);
          this.props.navigation.navigate('drawer');
        } else {
          this.setState({ loading: false });
        }
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('Ошибка сохранении в AsyncStorage! ' + error);
    }
  };


  componentDidMount() {
    console.log('HELLO');
  }

  render() {
    return (
      <Main>
        <Container>
          <ImageBackground
            source={require('../assets/design/home/back.png')}
            style={{ width: '100%', height: '100%' }}>
            <Header style={{ elevation: 0 }} noShadow transparent />
            <Content
              contentContainerStyle={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
              {/* Login Form */}
              {this.state.loading ? (
                <Spinner color="red" />
              ) : (
                <View>
                  <KeyboardAvoidingView behavior="padding" enabled>
                    <Form
                      style={{
                        marginTop: '10%',
                        marginLeft: 30,
                        marginRight: 30,
                      }}>
                      <Item
                        regular
                        style={{
                          margin: 5,
                          borderRadius: 8,
                          backgroundColor: 'white',
                          borderColor: 'white',
                        }}>
                        <Input
                          value={this.state.username}
                          onChangeText={(username) => this.setState({ username })}
                          placeholder="Логин"
                        />
                      </Item>
                      <Item
                        regular
                        style={{
                          margin: 5,
                          borderRadius: 8,
                          backgroundColor: 'white',
                          borderColor: 'white',
                        }}>
                        <Input
                          value={this.state.password}
                          onChangeText={(password) => this.setState({ password })}
                          placeholder="Пароль"
                          secureTextEntry={true}
                        />
                      </Item>
                    </Form>
                  </KeyboardAvoidingView>
                  <Button
                    block
                    style={{
                      marginLeft: 30,
                      marginRight: 30,
                      marginTop: 30,
                      backgroundColor: 'white',
                      opacity: 0.5,
                      borderRadius: 16,
                    }}
                    onPress={this.onLogin}>
                    <Text style={{ color: '#056372' }}>Войти</Text>
                  </Button>
                  <Button
                    transparent
                    block
                    onPress={() => this.props.navigation.navigate('Registration')}>
                    <Text style={{ textDecorationLine: 'underline', fontWeight: '400' }}>
                      Регистрация
                    </Text>
                  </Button>
                </View>
              )}
            </Content>
            <Footer style={{ backgroundColor: '#047B7F', height: 30 }}>
              <FooterTab style={{ backgroundColor: '#047B7F' }}></FooterTab>
            </Footer>
          </ImageBackground>
        </Container>
      </Main>
    );
  }
}

export default Login;
