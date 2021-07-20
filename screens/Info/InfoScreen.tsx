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

function RenderInfo({ title, list, onPressList }) {
  return (
    <>
      <PaperList.Item
        title={title}
        left={(props) => (
          <PaperList.Icon {...props} icon="chevron-down" color="#6200ee" />
        )}
        titleStyle={{ color: '#6200ee' }}
      />
      <List>
        {list.map((data, i) => (
          <ListItem avatar key={i} onPress={() => onPressList(data)}>
            <Left>
              <Ionicons
                name="ios-information-circle"
                color="#047B7F"
                style={{ fontSize: 20, paddingVertical: 5 }}
              />
            </Left>
            <Body>
              <Text style={{ fontSize: 12, paddingVertical: 5 }}>
                {data.recom_name}
              </Text>
              <Text style={{ fontSize: 12 }} note>
                {data.recom_date}
              </Text>
            </Body>
          </ListItem>
        ))}
      </List>
    </>
  );
}

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
        this._getRecommendations();
      });
    } catch (error) {
      console.log('error' + error);
    }
  };

  _getRecommendations = async () => {
    try {
      const API_URL = `${API}backend/getRecommendations?h=ast2`;

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          token: this.state.token,
        },
      });
      const responseJson = await response.json();
      if (responseJson !== null) {
        var data = responseJson;
        if (data.success) {
          this.setState({ list: data.recoms });
          this.setState({ loadingList: false });
        } else {
          console.log('Ошибка! Попробуйте еще раз');
        }
      }
    } catch (error) {
      this.setState({ loadingList: false });
    }
  };

  onPressList = (data) => {
    this.props.navigation.push('InfoDetails', {
      data,
    });
  };

  _renderHeader(title, expanded) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          padding: 10,
          backgroundColor: '#fafafa',
        }}>
        {expanded ? (
          <Ionicons
            style={{ fontSize: 20, paddingVertical: 10 }}
            name="arrow-dropdown-circle"
          />
        ) : (
          <Ionicons
            style={{ fontSize: 20, paddingVertical: 10 }}
            name="arrow-dropright-circle"
          />
        )}

        <Text
          style={{
            paddingLeft: 3,
            fontWeight: '400',
            color: '#212529',
            paddingVertical: 10,
          }}>
          {title}
        </Text>
      </View>
    );
  }

  _renderContent = () => {
    return (
      <List>
        {this.state.list.map((data, i) => (
          <ListItem avatar key={i} onPress={() => this.onPressList(data)}>
            <Left>
              <Ionicons
                name="information-circle"
                color="#047B7F"
                style={{ fontSize: 20, paddingVertical: 5 }}
              />
            </Left>
            <Body>
              <Text style={{ fontSize: 12, paddingVertical: 5 }}>
                {data.recom_name}
              </Text>
              <Text style={{ fontSize: 12 }} note>
                {data.recom_date}
              </Text>
            </Body>
          </ListItem>
        ))}
      </List>
    );
  };

  render() {
    return (
      <Container>
        <Header style={styles.headerTop}>
          <Body style={{ flex: 3 }}>
            <Title style={{ color: '#a2a3b7' }}>Информация</Title>
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
                  this.props.navigation.navigate('PriemStack');
                }}>
              <Image
                  resizeMode={'contain'}
                  style={{ width: '100%', height: 100 }}
                  source={require('../../assets/design/home/1.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                        width: '50%',
                        padding: 10,
                      }}
                onPress={() => {
                  this.props.navigation.navigate('InfoScreenStack');
                }}>
              <Image
                  resizeMode={'contain'}
                  style={{ width: '100%', height: 100 }}
                  source={require('../../assets/design/home/2.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                        width: '50%',
                        padding: 10,
                      }}
                onPress={() => {
                  this.props.navigation.navigate('ResultsStack');
                }}>
              <Image
                  resizeMode={'contain'}
                  style={{ width: '100%', height: 100 }}
                  source={require('../../assets/design/home/3.png')}
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
                  style={{ width: '100%', height: 100 }}
                  source={require('../../assets/design/home/4.png')}
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
    backgroundColor: '#1a192a',
  },
  rowBottom: {
    zIndex: 1,
    marginTop: -40,
  },
});

