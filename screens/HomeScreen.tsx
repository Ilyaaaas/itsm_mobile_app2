import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Title,
  Right,
  Icon,
  FooterTab,
  Footer,
  List,
  ListItem,
  ActionSheet,
  Toast,
} from 'native-base';
import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, Linking} from 'react-native';
import * as Location from 'expo-location';
import Main from './Main';
import { isNotUndefined } from './helpers';
import {API, getToken} from './constants';

var BUTTONS = ["Вызов", "Отправить геоданные", "Отмена"];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 3;

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      user: {
        fname: '',
        sname: '',
        section_txt: '',
      },
      token: ''
    };
  }

  componentDidMount() {
    this.checkLogIn();
    this._retrieveData();
  }

  _retrieveData = () => {
    AsyncStorage.getItem('user_data').then((value) => {
      if (value) {
        const obj = JSON.parse(value);
        this.setState({ user: obj });
      }
    });
  };

  checkLogIn = async () => {
    getToken().then(itoken => {
      this.setState({ token: itoken});
    });
  };

  call911 = async (id) => {
    if(id == 0) {
      Linking.openURL(`tel:+77172707903`);
    }

    if(id == 1){
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});
      let lat = location.coords.latitude;
      let lon = location.coords.longitude;

      const API_URL = `${API}backend/setgeodan`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'token' : this.state.token,
        },
        body: `longtitude=${lon}&latitude=${lat}`,
      });

      const responseJson = await response.json();

      if (responseJson !== null) {
        Toast.show({
          text: responseJson.message,
          type: 'success',
          buttonText: 'Ok',
          duration: 3000,
        });
      }

    }
  }

  render() {
    const { user } = this.state;

    return (
      <Main>
        <Container>
          <Header style={styles.headerTop}>
            <Left style={{ flex: 1 }}>
              <Ionicons
                name="ios-menu"
                style={{ color: '#046475', marginTop: 10, marginLeft: 10 }}
                onPress={() => this.props.navigation.openDrawer()}
                size={24}
              />
            </Left>
            <Body style={{ flex: 3 }}>
              <Title style={{ color: '#046475' }}>Медицинские услуги </Title>
            </Body>
            <Right />
          </Header>

          <Content>
            <List>
              <ListItem noBorder>
                <Left style={{ flex: 1 }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 20,
                      }}>
                      {isNotUndefined(user.fname)} {isNotUndefined(user.sname)}
                    </Text>
                    <Text>{user.section_txt}</Text>
                  </View>
                </Left>
                <Right>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: 70,
                      height: 70,
                    }}
                    onPress={() => {
                      ActionSheet.show(
                          {
                            options: BUTTONS,
                            cancelButtonIndex: CANCEL_INDEX,
                            destructiveButtonIndex: DESTRUCTIVE_INDEX,
                          },
                          buttonIndex => {
                            this.call911(buttonIndex);
                          }
                      )
                    }}>
                    <Image
                      style={{ width: 65, height: 65 }}
                      source={require('../assets/design/home/call103.png')}
                    />
                  </TouchableOpacity>
                </Right>
              </ListItem>
            </List>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <TouchableOpacity
                style={{ marginVertical: 10 }}
                onPress={() => {
                  this.props.navigation.navigate('PriemStack');
                }}>
                <Image
                  resizeMode={'contain'}
                  style={{ width: '100%', height: 100 }}
                  source={require('../assets/design/home/1.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginVertical: 10 }}
                onPress={() => {
                  this.props.navigation.navigate('InfoScreenStack');
                }}>
                <Image
                  resizeMode={'contain'}
                  style={{ width: '100%', height: 100 }}
                  source={require('../assets/design/home/2.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginVertical: 10 }}
                onPress={() => {
                  this.props.navigation.navigate('ResultsStack');
                }}>
                <Image
                  resizeMode={'contain'}
                  style={{ width: '100%', height: 100 }}
                  source={require('../assets/design/home/3.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginVertical: 10 }}
                onPress={() => {
                  this.props.navigation.navigate('ContactsScreen');
                }}>
                <Image
                  resizeMode={'contain'}
                  style={{ width: '100%', height: 100 }}
                  source={require('../assets/design/home/4.png')}
                />
              </TouchableOpacity>
            </View>
          </Content>
          <Footer style={{ backgroundColor: '#047B7F', height: 30 }}>
            <FooterTab style={{ backgroundColor: '#047B7F' }} />
          </Footer>
        </Container>
      </Main>
    );
  }
}

export default HomeScreen;

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
  row: {
    zIndex: 1,
  },
  columnLeft: {
    marginRight: 10,
    alignItems: 'flex-end',
  },
  columnRight: {
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  chat: {
    marginTop: -40,
    zIndex: 999,
  },
  rowBottom: {
    zIndex: 1,
    marginTop: -40,
  },
});
