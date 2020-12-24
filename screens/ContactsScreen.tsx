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
    if (url) Linking.openURL('https://bmcudp.kz');
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
              name="ios-menu"
              style={{ color: '#046475', marginTop: 10, marginLeft: 10 }}
              onPress={() => this.props.navigation.openDrawer()}
              size={24}
            />
          </Left>
          <Body style={{ flex: 3 }}>
            <Title style={{ color: '#046475', fontSize: 20 }}>Контакты</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          <ListItem>
            <Ionicons
              name="ios-pin"
              color="#047B7F"
              style={{ fontSize: 20, color: '#047B7F', paddingVertical: 5 }}
            />
            <Body style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 12 }} note>
                Адрес
              </Text>
              <Text
                style={{ fontSize: 14, paddingVertical: 5 }}
                onPress={() => this._handleClickLink(false)}>
                г.Нур-Султан, район Есиль, проспект Мәңгілік ел, 80/Е495
              </Text>
            </Body>
          </ListItem>
          <ListItem>
            <Ionicons
              name="ios-call"
              color="#047B7F"
              style={{ fontSize: 20, color: '#047B7F', paddingVertical: 5 }}
            />
            <Body style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 12 }} note>
                Call center
              </Text>
              <Text
                style={{ fontSize: 14, paddingVertical: 5 }}
                onPress={() => this._handleClickPhone('+7 (7172) 70-80-90')}>
                +7 (7172) 70-80-90
              </Text>
              <Text style={{ fontSize: 12 }} note>
                Приемное отделение
              </Text>
              <Text
                style={{ fontSize: 14, paddingVertical: 5 }}
                onPress={() => this._handleClickPhone('+7 (7172) 70-79-12')}>
                +7 (7172) 70-79-12
              </Text>
              <Text style={{ fontSize: 12 }} note>
                Скорая помощь
              </Text>
              <Text
                style={{ fontSize: 14, paddingVertical: 5 }}
                onPress={() => this._handleClickPhone('+7 (7172) 70-79-03')}>
                +7 (7172) 70-79-03, 70-79-04
              </Text>
            </Body>
          </ListItem>
          <ListItem>
            <Ionicons
              name="ios-link"
              color="#047B7F"
              style={{ fontSize: 20, color: '#047B7F', paddingVertical: 5 }}
            />
            <Body style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 12 }} note>
                Сайт
              </Text>
              <Text
                style={{ fontSize: 14, paddingVertical: 5 }}
                onPress={this._handleClickLink}>
                bmcudp.kz
              </Text>
            </Body>
          </ListItem>
          <ListItem>
            <Ionicons
              name="ios-time"
              style={{ fontSize: 20, color: '#047B7F', paddingVertical: 5 }}
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
            <Ionicons
              name="ios-bus"
              style={{ fontSize: 20, color: '#047B7F', paddingVertical: 5 }}
            />
            <Body style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 12 }} note>
                Как до нас добраться
              </Text>
              <Text style={{ fontSize: 14, paddingVertical: 5 }}>
                Автобусы: 12, 51, 40, 47, 53, 100 экспресс, 102 экспресс{' '}
              </Text>
              <Text
                  style={{ fontSize: 16, paddingVertical: 5}}
                  onPress={() => {Linking.openURL('https://2gis.kz/nur_sultan/geo/71.426232%2C51.07591?m=71.426499%2C51.075907%2F17.17')}}
              >
                <Entypo name="location-pin" size={24} color="black" />
                2gis
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
                    style={{ fontSize: 20, color: '#047B7F', paddingVertical: 5 }}
                />
                <Text
                    style={{ fontSize: 14, paddingVertical: 5, marginLeft: 20 }}
                    onPress={() => {Linking.openURL('https://www.facebook.com/bmcudp.kz/')}}
                >
                  FaceBook
                </Text>
              </View>

              <View  style={{ flexDirection: 'row'}}>
                <Ionicons
                  name="logo-instagram"
                  style={{ fontSize: 20, color: '#047B7F', paddingVertical: 5 }}
                />
                <Text
                    style={{ fontSize: 14, paddingVertical: 5, marginLeft: 20 }}
                    onPress={() => {Linking.openURL('http://www.instagram.com/bmcudprk')}}
                >
                  Instagram
                </Text>
              </View>
            </View>

          </ListItem>
        </Content>
        <Footer style={{ backgroundColor: '#047B7F', height: 30 }}>
          <FooterTab style={{ backgroundColor: '#047B7F' }} />
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
    backgroundColor: '#01A19F',
  },
  rowBottom: {
    zIndex: 1,
    marginTop: -40,
  },
});
