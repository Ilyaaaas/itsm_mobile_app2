import {Entypo, Ionicons} from '@expo/vector-icons';
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
} from 'native-base';
import React from 'react';
import {StyleSheet, StatusBar, Platform, Linking, View} from 'react-native';

class ContactsScreen extends React.Component {
  state = {
    loading: true,
  };

  _handleClickLink = (url = true) => {
    if (url) Linking.openURL('https://smart24.kz');
    else Linking.openURL('https://go.2gis.com/3cj1m');
  };

  _handleClickPhone = (tel) => {
    Linking.openURL(`tel:${tel}`);
  };

  render() {
    return (
      <Container>
        <Header style={styles.headerTop}>
          <Left style={{ flex: 1 }}>
            <Ionicons
                name="md-arrow-back"
                style={{ color: '#a2a3b7', marginLeft: 10 }}
                onPress={() => this.props.navigation.goBack()}
                size={24}
            />
          </Left>
          <Body style={{ flex: 3 }}>
            <Title style={{ color: '#a2a3b7', fontSize: 20 }}>Контакты</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <ListItem>
            <Ionicons
              name="ios-pin"
              color="#047B7F"
              style={{ fontSize: 20, color: '#1a192a', paddingVertical: 5 }}
            />
            <Body style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 12 }} note>
                Адрес
              </Text>
              <Text
                style={{ fontSize: 14, paddingVertical: 5 }}
                onPress={() => this._handleClickLink(false)}>
                ул. Кунаева 12/1 БЦ "На Водно-зеленом Бульваре"
              </Text>
            </Body>
          </ListItem>
          <ListItem>
            <Ionicons
              name="ios-call"
              color="#047B7F"
              style={{ fontSize: 20, color: '#1a192a', paddingVertical: 5 }}
            />
            <Body style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 12 }} note>
                E-mail
              </Text>
              <Text
                style={{ fontSize: 14, paddingVertical: 5 }}
                onPress={() => this._handleClickPhone('+7 (777) 777-77-77')}>
                info@qazcloud.kz
              </Text>
              <Text style={{ fontSize: 12 }} note>
                Call center
              </Text>
              <Text
                style={{ fontSize: 14, paddingVertical: 5 }}
                onPress={() => this._handleClickPhone('+7 (7172) 573 068')}>
                +7 (7172) 573 068
              </Text>
            </Body>
          </ListItem>
          <ListItem>
            <Ionicons
              name="ios-link"
              color="#047B7F"
              style={{ fontSize: 20, color: '#1a192a', paddingVertical: 5 }}
            />
            <Body style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 12 }} note>
                Сайт
              </Text>
              <Text
                style={{ fontSize: 14, paddingVertical: 5 }}
                onPress={this._handleClickLink}>
                smart24.kz
              </Text>
            </Body>
          </ListItem>
          <ListItem>
            <Ionicons
              name="ios-time"
              style={{ fontSize: 20, color: '#1a192a', paddingVertical: 5 }}
            />
            <Body style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 12 }} note>
                Время работы
              </Text>
              <Text style={{ fontSize: 14, paddingVertical: 5 }}>
                пн-сб 8:00 - 20:00
              </Text>
              <Text style={{ fontSize: 14, paddingVertical: 5 }}>
                вс 9:00 - 18:00
              </Text>
            </Body>
          </ListItem>

          <ListItem>
            <View style={{
              flex: 1,
              flexDirection: 'column',
            }}>
              <View>
                <Body style={{ paddingLeft: 25 }}>
                  <Text style={{ fontSize: 12 }} note>Наши социальные сети</Text>
                </Body>
              </View>
              <View style={{ flexDirection: 'row'}}>
                <Ionicons
                    name="logo-facebook"
                    style={{ fontSize: 20, color: '#1a192a', paddingVertical: 5 }}
                />
                <Text
                    style={{ fontSize: 14, paddingVertical: 5, marginLeft: 20 }}
                    onPress={() => {Linking.openURL('https://www.facebook.com/')}}
                >
                  FaceBook
                </Text>
              </View>

              <View  style={{ flexDirection: 'row'}}>
                <Ionicons
                  name="logo-instagram"
                  style={{ fontSize: 20, color: '#1a192a', paddingVertical: 5 }}
                />
                <Text
                    style={{ fontSize: 14, paddingVertical: 5, marginLeft: 20 }}
                    onPress={() => {Linking.openURL('http://www.instagram.com')}}
                >
                  Instagram
                </Text>
              </View>
            </View>

          </ListItem>
        </Content>
        <Footer style={{ backgroundColor: '#1a192a', height: 30 }}>
          <FooterTab style={{ backgroundColor: '#1a192a' }} />
        </Footer>
      </Container>
    );
  }

  async UNSAFE_componentWillMount() {
    this.setState({ loading: false });
  }
}

export default ContactsScreen;

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
