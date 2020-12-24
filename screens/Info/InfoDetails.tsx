import {
  Container,
  Content,
  Header,
  Left,
  Button,
  Right,
  Icon,
  FooterTab,
  Body,
  Footer,
  Text,
  Title,
  Spinner,
} from 'native-base';
import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  AsyncStorage,
} from 'react-native';

import { API, getToken } from '../constants';

class InfoDetails extends React.Component {
  state = {
    loading: true,
    props_data: {},
    recom_text: '',
    token: '',
  };

  _getToken = async () => {
    try {
      getToken().then(itoken => {
        this.setState({ token: itoken });
        this._getRecommendationText();
      });
    } catch (error) {
      console.log('error ' + error);
    }
  };

  _getRecommendationText = async () => {
    try {
      const API_URL = `${API}backend/getRecommendationText?h=ast2&rid=${this.state.props_data.recom_id}`;

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
        if (data.success) {
          this.setState({ recom_text: data.recom_text, loading: false });
        } else {
          this.setState({ loading: false });
        }
      }
    } catch (error) {
      console.log(
        'Error when call API (_getRecommendationText): ' + error.message
      );
    }
    this.setState({ loading: false });
  };

  _getOnlyText(html) {
    const regex = /(<([^>]+)>)/gi;
    const result = html.replace(regex, '');
    return result.replace(/[&]nbsp[;]/gi, ' ');
  }
  render() {
    return (
      <Container>
        <Header style={styles.headerTop}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{ color: '#046475' }} />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title style={{ color: '#046475', fontSize: 20 }}>Информация</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          {this.state.loading ? (
            <Spinner color="red" />
          ) : (
            <ScrollView>
              <View>
                <Text style={{ fontSize: 20, paddingVertical: 10 }}>
                  {this.state.props_data.recom_name}
                </Text>
                <Text style={{ fontSize: 12 }} note>
                  {this.state.props_data.recom_date}
                </Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>
                  Рекомендации
                </Text>
                <Text style={{ fontSize: 12 }}>
                  {this._getOnlyText(this.state.recom_text)}
                </Text>
              </View>
            </ScrollView>
          )}
        </Content>
        <Footer style={{ backgroundColor: '#047B7F', height: 30 }}>
          <FooterTab style={{ backgroundColor: '#047B7F' }}></FooterTab>
        </Footer>
      </Container>
    );
  }

  async UNSAFE_componentWillMount() {
    this._getToken();
    const props_data = this.props.route.params.data;

    this.setState({ props_data });
  }
}

export default InfoDetails;

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
