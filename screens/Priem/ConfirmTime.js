import { Ionicons } from '@expo/vector-icons';
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
} from 'native-base';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

class ConfirmTime extends React.Component {
  render() {
    return (
      <Container>
        <ImageBackground
          source={require('../../assets/design/background.png')}
          style={{ width: '100%', height: '100%' }}>
          <Header style={{ backgroundColor: '#fff', height: 90 }}>
            <Left style={{ flex: 1, flexDirection: 'row' }}>
              <Icon
                name="ios-menu"
                style={{ color: '#5b7ea4', marginTop: 10, marginLeft: 10 }}
                onPress={() => this.props.navigation.openDrawer()}
                size={24}
              />
            </Left>
          </Header>

          <Content padder>
            <Grid>
              <Row style={styles.row}>
                <Text>ConfirmTime</Text>
              </Row>
            </Grid>
          </Content>
          <Footer style={{ backgroundColor: '#5b7ea4' }}>
            <FooterTab style={{ backgroundColor: '#5b7ea4' }}></FooterTab>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }
}

export default ConfirmTime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    zIndex: 1,
  },
  columnLeft: {
    marginLeft: 20,
  },
  chat: {
    marginLeft: 10,
    marginTop: -40,
    zIndex: 999,
  },
  rowBottom: {
    zIndex: 1,
    marginTop: -40,
  },
});
