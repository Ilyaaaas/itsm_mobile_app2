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
} from 'native-base';
import React from 'react';
import { StyleSheet, AsyncStorage, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

import { API, getToken } from '../constants';

class ResultsShow extends React.Component {
  state = {
    loading: false,
    token: '',
    list: {dd: 'sssssssddd'},
    loadingFont: true,
    url: '',
  };

  _getToken = async () => {
    getToken().then(itoken => {
      this.setState({ token: itoken });
    });
  };

  _getAnalizeResultLoad = async () => {
    getToken().then(itoken => {
      const API_URL = `${API}backend/analiz?h=ast2&rid=${this.props.route.params.data.reg_id}&tid=${this.props.route.params.data.take_id}&token=${itoken}`;
      console.log(API_URL);
      this.setState({ url: API_URL, token: itoken })
    });
  }

  pressDownloadPDF = () => {
    const url = `${API}backend/getpdf?rid=${this.props.route.params.data.reg_id}&tid=${this.props.route.params.data.take_id}&token=${this.state.token}`;
    Linking.openURL(url);
  };

  UNSAFE_componentWillMount() {
    this.setState({ props_data: this.props.route.params.data, loadingFont: false});
    this._getToken();
    this._getAnalizeResultLoad();
  }

  render() {
    if (this.state.loadingFont) {
      return <></>;
    }

    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Header style={styles.headerTop}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" style={{ color: '#046475' }} />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title style={{ color: '#046475', fontSize: 20 }}>Результаты</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Button
            iconLeft
            style={{
              padding: 10,
              backgroundColor: '#01A19F',
              marginTop: 10,
            }}
            onPress={() => this.pressDownloadPDF()}>
            <Icon name="cloud-download" style={{ color: 'white' }} />
            <Text style={{ color: '#046475' }}>Скачать PDF</Text>
          </Button>
          <WebView source={{ uri: this.state.url }} style={styles.webview}/>
        </Content>
        <Footer style={{ backgroundColor: '#047B7F', height: 30 }}>
          <FooterTab style={{ backgroundColor: '#047B7F' }} />
        </Footer>
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
  rowBottom: {
    zIndex: 1,
    marginTop: -40,
  },
  webview: {
    flex: 1,
    width: '100%',
    height: 700,
    margin: 0,
    padding: 0,
  },
});

export default ResultsShow;