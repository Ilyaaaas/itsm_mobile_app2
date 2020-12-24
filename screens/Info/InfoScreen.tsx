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
  Spinner,
} from 'native-base';
import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
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
          <Left style={{ flex: 1 }}>
            <Ionicons
              name="ios-menu"
              style={{ color: '#046475', marginTop: 10, marginLeft: 10 }}
              onPress={() => this.props.navigation.openDrawer()}
              size={24}
            />
          </Left>
          <Body style={{ flex: 3 }}>
            <Title style={{ color: '#046475', fontSize: 20 }}>Информация</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          {this.state.loadingList ? (
            <Spinner color="red" />
          ) : (
            <View>
              <ListItem>
                <Ionicons
                  name="ios-person"
                  color="#047B7F"
                  style={{ fontSize: 40, paddingVertical: 5 }}
                />
                <Body style={{ paddingLeft: 10 }}>
                  <Text style={{ fontSize: 20, paddingVertical: 5 }}>
                    {isNotUndefined(this.state.user.fname) || 'АЛИМКУЛОВ'}{' '}
                    {this.state.user.sname || 'КАДЫР'}
                  </Text>
                  <Text style={{ fontSize: 12 }} note>
                    {isNotUndefined(this.state.user.bday) || '01.01.1949'}
                  </Text>
                  <Text style={{ fontSize: 12 }} note>
                    {isNotUndefined(this.state.user.iin) || '490101300712'}
                  </Text>
                  <Text style={{ fontSize: 12 }} note>
                    {isNotUndefined(this.state.user.section_txt) || ''}
                  </Text>
                </Body>
              </ListItem>
              <RenderInfo
                title="ПРЕДЫДУЩИЕ РЕКОМЕНДАЦИИ"
                list={this.state.list}
                onPressList={this.onPressList}
              />
            </View>
          )}
        </Content>
        <Footer style={{ backgroundColor: '#047B7F', height: 30 }}>
          <FooterTab style={{ backgroundColor: '#047B7F' }} />
        </Footer>
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
    backgroundColor: '#01A19F',
  },
  rowBottom: {
    zIndex: 1,
    marginTop: -40,
  },
});
