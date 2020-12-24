import axios from 'axios';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  List,
  ListItem,
  Text,
  Thumbnail,
  Left,
  Right,
  Body,
  FooterTab,
  Footer,
  Spinner,
  Toast,
} from 'native-base';
import React from 'react';
import { StyleSheet, AsyncStorage, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { setFormInfo } from '../../actions/form-actions';
import { BaseBackendDataInterface } from '../../types/base-backend-data.interface';
import { DOCTOR, getToken } from '../constants';

class ChooseDoctor extends React.Component {
  state = {
    loading: true,
    list: [],
    token: '',
    spec_code: '',
  };

  _getToken = async () => {
    try {
      await getToken().then(itoken => {
        this.setState({ token: itoken }, this._getShedule);
      });
    } catch (error) {
      console.log('error get Token' + error);
    }
  };

  _getShedule = async () => {
    const spec_code = this.props.route.params.typeId;
    try {
      const { data } = await axios.get<BaseBackendDataInterface>(
        `getShedule?h=ast2&d=-2&spec_cod=${spec_code}`,
        {
          headers: {
            token: this.state.token,
          },
        }
      );
      this.setState({ list: Object.keys(data).map((key) => data[key]) });
    } catch (error) {
      Toast.show({ text: 'Список специалистов пуст', type: 'danger' });
    }
    this.setState({ loading: false });
  };

  onGoBack = () => {
    this.props.navigation.goBack();
  };

  onPressList = (item) => {
    const data = {
      spec_code: this.state.spec_code,
      doctorId: item.doc_id,
      name: item.spec_name,
      cabinet: item.cab_num,
      shedule: item.shedules,
    };
    this.props.setFormInfo(DOCTOR, data);
    this.props.navigation.goBack();
  };
/*
  onDoctorDetailClicked = () => {
    this.props
  }
*/
  render() {
    const items = this.state.list;
    return (
      <Container>
        <Header style={styles.headerTop}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => this.onGoBack()}>
              <Icon name="arrow-back" style={{ color: '#046475' }} />
            </Button>
          </Left>
          <Body style={{ flex: 3 }}>
            <Title style={{ color: '#046475', fontSize: 20 }}>
              Выберите специалиста
            </Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.state.loading ? (
            <Spinner color="red" />
          ) : (
            <List>
              {items.map((item, i) => (
                <ListItem
                  avatar
                  key={i}
                  onPress={() => this.onPressList(item)}
                  style={{ paddingVertical: 5 }}>
                  <Left>
                    <Thumbnail
                      small
                      source={{
                        uri:
                          'https://garden.zendesk.com/css-components/avatars/images/jz.png',
                      }}
                      style={{ paddingVertical: 5 }}
                    />
                  </Left>
                  <Body>
                    <Text style={{ paddingVertical: 5 }}>{item.spec_name}</Text>
                  </Body>
                  <Right>
                    <TouchableOpacity 
                    activeOpacity={0.7}
                    style={{
                      width: 50,
                      height: 30,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={() => this.props.navigation.navigate('DoctorDetail',{
                      docId: item.doc_id,
                    })}
                    >
                      <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: '#01A19F',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                     >
                      <Ionicons
                          name="md-information"
                          style={{ color: '#046475'}}
                          size={24}
                        />
                    </View>
                    </TouchableOpacity>
                    
                  </Right>
                </ListItem>
              ))}
            </List>
          )}
        </Content>

        <Footer style={{ backgroundColor: '#047B7F', height: 30 }}>
          <FooterTab style={{ backgroundColor: '#047B7F' }}></FooterTab>
        </Footer>
      </Container>
    );
  }

  componentDidMount() {
    const spec_code = this.props.route.params.typeId;
    this.setState({ spec_code }, this._getToken);
  }
}

const mapDispatchToProps = {
  setFormInfo,
};

export default connect(null, mapDispatchToProps)(ChooseDoctor);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTop: {
    backgroundColor: '#01A19F',
  },
});
