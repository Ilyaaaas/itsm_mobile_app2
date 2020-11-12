import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  List,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  FooterTab,
  Footer,
  Spinner,
} from 'native-base';
import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';

import { setFormInfo } from '../../actions/form-actions';
import { SPEC_TYPE, API } from '../constants';

class ChooseType extends React.Component {
  state = {
    loading: true,
    list: [],
    token: '',
  };

  onGoBack = () => {
    this.props.navigation.goBack();
  };

  async UNSAFE_componentWillMount() {
    this._getToken();
  }

  _getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');

      if (value !== null) {
        this.setState({ token: value }, () => {
          this._getSpecList();
        });
      }
    } catch (error) {
      console.log('error get Token' + error);
    }
  };

  _getSpecList = async () => {
    try {
      const API_URL = `${API}backend/getSpecList?h=ast2`;

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
        // console.log('DOC Specialty: ', JSON.stringify(data));
        if (data) {
          this.setState({ list: data });
        } else {
          console.log('Ошибка! Попробуйте еще раз');
        }
      }
    } catch (error) {
      console.log('Error when call API _getAnalyzes: ' + error.message);
    }
    this.setState({ loading: false });
  };

  onPressList = (id, name) => {
    this.props.setFormInfo(SPEC_TYPE, { id, name });
    this.props.navigation.goBack();
    return;
    const isOnlyPriem = navigation.getParam('isOnlyPriem', false);

    if (isOnlyPriem) {
      const data = [];
      data['typeId'] = id;
      this.props.navigation.push('ChooseTime', {
        data,
      });
    } else {
      this.props.navigation.push('ChooseDoctor', {
        typeId: id,
      });
    }
  };

  render() {
    return (
      <Container>
        <Header style={styles.headerTop}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => this.onGoBack()}>
              <Ionicons
                size={24}
                name="ios-arrow-back"
                style={{ color: '#046475' }}
              />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title style={{ color: '#046475' }}>Выберите категорию</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.state.loading ? (
            <Spinner color="red" />
          ) : (
            <List>
              {this.state.list.map((data, i) => (
                <ListItem
                  avatar
                  key={i}
                  onPress={() =>
                    this.onPressList(data.spec_cod, data.spec_name)
                  }>
                  <Left>
                    <Ionicons
                      name="ios-create"
                      color="#5b7ea4"
                      style={{ fontSize: 20, paddingVertical: 5 }}
                    />
                  </Left>
                  <Body>
                    <Text style={{ paddingVertical: 5 }}>{data.spec_name}</Text>
                  </Body>
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
}

const mapDispatchToProps = {
  setFormInfo,
};

export default connect(null, mapDispatchToProps)(ChooseType);

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
});
