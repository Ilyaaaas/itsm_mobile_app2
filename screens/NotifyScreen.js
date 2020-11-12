import {Container, Content, Header, Left, Icon, FooterTab, Footer,} from 'native-base';
import React from 'react';
import {StyleSheet, Text, ImageBackground,} from 'react-native';
import { Row, Grid } from 'react-native-easy-grid';

class NotifyScreen extends React.Component {
  static navigationOptions = {
    drawerIcon: ({ tintColor }) => (
      <Icon name="notifications" style={{ color: tintColor }} />
    ),
  };

  render() {
    return (
      <Container>
        <ImageBackground
          source={require('../assets/design/background.png')}
          style={{ width: '100%', height: '100%' }}>
          <Header>
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
                <Text>NotifyScreen</Text>
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

export default NotifyScreen;

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
