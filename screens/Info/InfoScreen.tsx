import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Content,
  Header,
  Left,
  Right,
  FooterTab,
  Body,
  Footer,
  View,
  Text,
  Title,
  ListItem,
  List,
  Spinner, ActionSheet,
} from 'native-base';
import React from 'react';
import { StyleSheet, AsyncStorage, TouchableOpacity, Image } from 'react-native';
import { List as PaperList } from 'react-native-paper';

import { API, getToken } from '../constants';
import { isNotUndefined } from '../helpers';

class InfoScreen extends React.Component {
  state = {
    loading: true,
    loadingList: true,
    token: '',
    user: {},
    list: [],
  };

  _getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('user_data');

      if (value !== null) {
        const res = JSON.parse(value);
        this.setState({ user: res });
      }
    } catch (error) {
      console.log('error' + error);
    }
  };

  _getToken = async () => {
    try {
      getToken().then(itoken => {
        this.setState({ token: itoken });
      });
    } catch (error) {
      console.log('error' + error);
    }
  };

  render() {
    return (
      <Container>
        <Header style={styles.headerTop}>
          <Body style={{ flex: 3 }}>
            <Title style={{ color: '#1a192a' }}>Сервисы</Title>
          </Body>
        </Header>

        <Content>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',}}>
            <TouchableOpacity
                style={{
                        width: '50%',
                        padding: 10,
                      }}
                onPress={() => {
                  this.props.navigation.navigate('AboutStack');
                }}>
              <Image
                  resizeMode={'contain'}
                  style={{ width: '100%', height: 300 }}
                  source={require('../../assets/design/home/1.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                        width: '50%',
                        padding: 10,
                      }}
                onPress={() => {
                  this.props.navigation.navigate('ContactsScreen');
                }}>
              <Image
                  resizeMode={'contain'}
                  style={{ width: '100%', height: 300 }}
                  source={require('../../assets/design/home/2.png')}
              />
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }

  componentDidMount() {
    this._getUserData();
    this._getToken();
  }
}

export default InfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTop: {
    backgroundColor: '#fff',
    borderBottomColor: '#898989',
  },
  rowBottom: {
    zIndex: 1,
    marginTop: -40,
  },
});

