import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as _ from 'lodash';
import moment from 'moment';
import {
  Container,
  Content,
  Header,
  Left,
  Right,
  FooterTab,
  Body,
  Footer,
  Text,
  Title,
  ListItem,
  List,
  Spinner,
} from 'native-base';
import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Button } from 'react-native-paper';

import { isNotUndefined } from '../helpers';
import { getToken } from '../constants';

class ResultsScreen extends React.Component {
  state = {
    loading: true,
    list: [],
    user: {},
    login: {},
    token: '',
    loadingFont: true,
    sortBy: 'desc',
  };

  _getUserData = () => {
    AsyncStorage.getItem('user_data').then((value) => {
      if (value) {
        const obj = JSON.parse(value);
        this.setState({ user: obj });
      }
    });
  };

  _getToken = async () => {
    getToken().then(itoken => {
      this.setState({ token: itoken }, this._getAnalyzes);
    });
  };

  _getAnalyzes = async () => {
    try {
      const { data } = await axios.get('getAnalyzes?h=ast2', {
        headers: {
          token: this.state.token,
        },
      });

      this.setState({ list: this.getSortedAnalyzes(data.analyzes) });
    } catch (error) {
      console.error(error);
    }
    this.setState({ loading: false });
  };

  onPressList = (data) => {
    this.props.navigation.navigate('ResultsShow', {
      data,
    });
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('user');

      if (value !== null) {
        const user = JSON.parse(value);
        this.setState({ login: user });
      }
    } catch (error) {
      console.log('error' + error);
    }
  };

  handleSortBy = () => {
    this.setState(
      {
        sortBy: this.state.sortBy === 'desc' ? 'asc' : 'desc',
      },
      () => {
        this.setState({
            list: this.getSortedAnalyzes(this.state.list)
        });

      }
    );
  };

  getSortedAnalyzes = (list) => {
    const sortedList = _.sortBy(list, (analyze) =>
      moment(analyze.analises_date, 'YYYY/MM/DD')
    );

    return this.state.sortBy === 'desc' ? _.reverse(sortedList) : sortedList;
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
            <Title style={{ color: '#046475', fontSize: 20 }}>Результаты</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          {this.state.loading ? (
            <Spinner color="red" />
          ) : (
            <List>
              <ListItem>
                <Ionicons
                  name="ios-person"
                  style={{ fontSize: 40, paddingVertical: 5 }}
                />
                <Body style={{ paddingLeft: 10 }}>
                  <Text style={{ fontSize: 20, paddingVertical: 5 }}>
                    {isNotUndefined(this.state.user.fname) || 'АЛИМКУЛОВ'}{' '}
                    {isNotUndefined(this.state.user.sname) || 'КАДЫР'}
                  </Text>
                  <Text style={{ fontSize: 12 }} note>
                    {isNotUndefined(this.state.user.bday) || '01.01.1949'}
                  </Text>
                  <Text style={{ fontSize: 12 }} note>
                    {isNotUndefined(this.state.user.iin) || '490101300712'}
                  </Text>
                </Body>
              </ListItem>
              <ListItem>
                <Button
                  icon={
                    this.state.sortBy === 'desc' ? 'chevron-down' : 'chevron-up'
                  }
                  onPress={this.handleSortBy}>
                  Сортировать по дате
                </Button>
              </ListItem>
              {this.state.list.map((data, i) => (
                <ListItem avatar key={i} onPress={() => this.onPressList(data)}>
                  <Left>
                    <Ionicons
                      name="ios-attach"
                      style={{ fontSize: 20, paddingVertical: 5 }}
                    />
                  </Left>
                  <Body>
                    <Text style={{ fontSize: 12, paddingVertical: 5 }}>
                      {data.analises_name}
                    </Text>
                    <Text style={{ fontSize: 12 }} note>
                      {data.analises_date}
                    </Text>
                  </Body>
                  <Right>
                    <Ionicons
                      name="ios-cloud-download"
                      style={{ fontSize: 20, paddingVertical: 5 }}
                    />
                  </Right>
                </ListItem>
              ))}
            </List>
          )}
        </Content>
        <Footer style={{ backgroundColor: '#047B7F', height: 30 }}>
          <FooterTab style={{ backgroundColor: '#047B7F' }} />
        </Footer>
      </Container>
    );
  }

  async componentDidMount() {
    this._retrieveData();
    this._getUserData();
    this._getToken();
  }
}

export default ResultsScreen;

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
