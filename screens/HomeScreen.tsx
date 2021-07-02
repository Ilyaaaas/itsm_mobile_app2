import {AntDesign, Ionicons} from '@expo/vector-icons';
import {
  Container,
  Content,
  Header,
  Left,
  Body,
  Title,
  Right,
  Icon,
  FooterTab,
  Footer,
  List,
  ListItem,
  ActionSheet,
  Toast, Root, Button,
} from 'native-base';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Linking,
  RefreshControl,
  Modal,
  ScrollView,
  TextInput,
  Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import Main from './Main';
import { isNotUndefined } from './helpers';
import {API, getToken} from './constants';
import StarRating from "react-native-star-rating";
import {WebView} from "react-native-webview";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

var BUTTONS = ["Вызов", "Отправить геоданные", "Отмена"];
var DESTRUCTIVE_INDEX = 2;
var CANCEL_INDEX = 3;

class HomeScreen extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      token: '',
      refreshing: false,
      list: [],
      isReview: null,
      docInfo: null,
      isDocReviewSelected: null,
      isDocInfoSelected: null,
      modal: false,
      listGrade: [],
      activeDoc: null,
      otziv: '',
      callPhone: '',
      ratingSet: 0,
      filterModal: false,
    }
  }

  _getUrl = async (url) => {
    const API_URL = API+url;

    await AsyncStorage.getItem('accessToken').then(req => JSON.parse(req))
        .then(json => console.log('accessToken '+json[0].accessToken))
        .then(json => {
          this.setState({ token: json[0].accessToken });
          // setAccessToken(json[0].accessToken);
          // setUserId(json[1].userId);
        })
        .then(json2 => console.log('json2'))
        .catch(error => console.log('error!'));

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          // 'x-api-key': this.state.token,
          'x-api-key': 'siwGYZ4040586lnjwjUdPIbQWIcyUli0',
        },
      });

      const responseJson = await response.json();
      return responseJson;
      // if (responseJson !== null) {
      //     if(responseJson.success == false){
      //         Toast.show({
      //             text: responseJson.message,
      //             type: 'danger',
      //             duration: 3000
      //         });
      //         return null;
      //     }
      //     return responseJson.result;
      // }
    } catch (error) {
      console.log('Error when call API: ' + error.message);
    }
    return null;
  }

  _getDoctorList = async () => {
    await this._getUrl('request?expand=status,product').then(value => {
      console.log('request2');
      console.log(value);
      if(value !== null){
        this.setState({ list: value.items});
      }
    })
  }

  _alert = async (msgToast, onSuccess = false) => {
    let tType = "success";
    if(onSuccess == false){
      tType = "danger";
    }
    Toast.show({
      text: msgToast,
      type: tType,
      duration: 3000
    });
  }

  _getToken = async () => {
    await getToken().then(itoken => {
      this.setState({token: itoken});
    })
  }

  _refreshPage = async () => {
    this.setState({refreshing: true});
    await this._getToken();
    await this._getDoctorList();
    this.setState({refreshing: false});
  }

  UNSAFE_componentWillMount() {
    this._refreshPage();
  }

  _onReviewButtonClicked = async (index) => {
    if (this.state.isDocReviewSelected === index) {
      this.setState({isDocReviewSelected: null});
    } else {
      this.setState({isDocReviewSelected: index});
    }
  }

  onInfoButtonClicked = async (docid) => {
    await this._getUrl('request/'+docid).then(value => {
      this.setState({ listGrade: value, activeDoc: docid, modal: true });
    })
  }

  goToCreateReq = () => {
    this.props.navigation.navigate('OfferScreen');
  }

  showFilter = () => {
    this.setState({ filterModal: true});
  }

  _setRetview = async () => {
    let API_URL = `${API}backend/set_grade`
    let showToast = false;
    let msgToast = '';
    if(this.state.ratingSet == 0){
      showToast = true;
      msgToast = 'Поставьте пожалуйста оценку';
    }

    if(showToast)
    {
      this._alert(msgToast, false);
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          // 'token': this.state.token,
          'token': 'siwGYZ4040586lnjwjUdPIbQWIcyUli0',
        },
        body: `id_doctor=${this.state.activeDoc}&grade=${this.state.ratingSet}&note=${this.state.otziv}&feedback=${this.state.callPhone}`,
      });

      const responseJson = await response.json();
      console.log(responseJson);
      if (responseJson !== null) {
        let itype = 'success';

        if(responseJson.success == false){
          itype = 'danger';
        }
        this.setState({activeDoc: null, modal: false, otziv: '', callPhone: '', ratingSet: 0 });
        this._getDoctorList();
        this._alert(responseJson.message, responseJson.success);
      }
    } catch (error) {
      console.log(error.message);
      this._alert("Ошибка отправки данных. Повторите еще раз");
    }
  }

  render() {
    var color = 'blue';
    console.log(this.state.list.items);
    console.log('list');
    return (
        <Container>
          <Root>
            <Header style={styles.headerTop}>
              <Left style={{ flex: 1}}>
                <Ionicons name="ios-menu"
                          style={{ color: '#a2a3b7', marginLeft: 10 }}
                          onPress={() => this.props.navigation.openDrawer()}
                          size={24}
                />
              </Left>
              <Body style={{ flex: 3 }}>
                <Title style={{ color: '#a2a3b7' }}>Мои заявки</Title>
              </Body>
              <Right>
                <AntDesign
                    name="pluscircle"
                    size={24}
                    color="#a2a3b7"
                    style={{marginRight: 10}}
                    onPress={() => this.goToCreateReq()}
                />
                <AntDesign
                    name="filter"
                    size={24}
                    color="#a2a3b7"
                    style={{marginRight: 10}}
                    onPress={() => this.showFilter()}
                />
              </Right>
            </Header>
            <Content
                refreshControl={
                  <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._refreshPage}
                  />
                }
            >
              {this.state.refreshing ? (
                  <Text style={{ textAlign: "center", fontSize: 14, flex: 1, marginTop: 20, width: '100%' }}>Подождите идет загрузка данных</Text>
              ) : (
                  <List>
                    {this.state.list.map((doc, i) => (
                        <ListItem key={i} style={{ paddingBottom: 5, paddingTop: 15 }}>
                          <Body>
                            <Text style={styles.textName}>{doc.descr}</Text>
                            <View style={styles.starContainer}>
                              <Text style={styles.textSpecialty}>{doc.spr_value}</Text>
                            </View>
                            <View style={styles.buttonsContainer}>
                              <TouchableOpacity
                                  activeOpacity={0.7}
                                  style={[styles.button, styles.btn]}
                                  onPress={() => this._onReviewButtonClicked(i)}
                              >
                                <Text style={{ color: '#fff' }}>Подробнее</Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                  activeOpacity={0.7}
                                  style={[styles.button, styles.btn]}
                                  onPress={() => this.onInfoButtonClicked(doc.id)}
                              >
                                <Text style={{ color: '#fff' }}>Сменить статус</Text>
                              </TouchableOpacity>
                            </View>
                            {this.state.isDocReviewSelected == i &&
                            <View style={{ marginBottom: 10, marginTop: 10 }}>
                              <Text style={styles.textSpecialty}>Дата: { doc.category_name || "" }</Text>
                              <Text style={styles.textSpecialty}>Приоритет: {doc.science_degree}</Text>
                            </View>
                            }
                          </Body>
                          <Right>
                            <View style={{ marginBottom: 10, marginTop: 10 }}>
                              <AntDesign
                                  name="warning"
                                  size={24}
                                  color={doc.status.color_class}
                                  style={{marginRight: 10}}
                                  onPress={() => this.getPriemForm()}
                              />
                              <Text style={styles.textSpecialty}>{doc.status.name}</Text>
                            </View>
                          </Right>
                        </ListItem>
                    ))}
                  </List>
              )}
            </Content>
          </Root>
          <Modal
              animationType={"slide"}
              visible={this.state.modal}
          >
            <Root>
              <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <ScrollView style={{ paddingTop: 40 }}>
                  <View>
                    <Text style={styles.textName}>Заголовок: </Text>
                    <Text>{this.state.listGrade.descr}</Text>
                  </View>
                  <View>
                    <Text style={styles.textName}>Описание: </Text>
                    <Text>{this.state.listGrade.response}</Text>
                  </View>
                  <View>
                    <Text style={styles.textName}>Дата создания: </Text>
                    <Text>{this.state.listGrade.createdAt}</Text>
                  </View>
                </ScrollView>
                <View style={{ borderTopWidth: 1,}}>
                  <List>
                    <ListItem noBorder>
                      <TextInput
                          style={styles.textArea}
                          underlineColorAndroid="transparent"
                          placeholder="Комментарий"
                          placeholderTextColor="grey"
                          numberOfLines={2}
                          multiline={true}
                          onChangeText={text => this.setState({ otziv: text})}
                      />
                    </ListItem>
                    <ListItem noBorder style={{ marginTop: -20 }}>
                      <TextInput
                          style={styles.contactInput}
                          underlineColorAndroid="transparent"
                          placeholder="Ваши контакты"
                          placeholderTextColor="grey"
                          onChangeText={text => this.setState({callPhone: text})}
                      />
                    </ListItem>
                  </List>
                  <List>
                    <ListItem>
                      <Left>
                        <Button
                            success={true}
                            style={{ width: '90%', borderRadius: 10 }}
                            onPress={() => {
                              this.setState({modal: false});
                            }}
                        >
                          <Text style={{ width: '100%', textAlign: "center"}}>Закрыть</Text>
                        </Button>
                      </Left>
                      <Body>
                        <Button
                            style={{ width: '90%', borderRadius: 10 }}
                            onPress={() => { this._setRetview() }}
                        >
                          <Text style={{ width: '100%', textAlign: "center"}}>Принять</Text>
                        </Button>
                      </Body>
                    </ListItem>
                  </List>
                </View>
              </View>
            </Root>
          </Modal>
          <Modal
              transparent={true}
              visible={this.state.filterModal}
              contentContainerStyle={styles.filterModal}
              onRequestClose={()=>this.setState({ filterModal: false})}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'}}>
              <View style={{
                backgroundColor: 'white',
                width: 400,
                height: 300}}>
                <Text onPress={()=>this.setState({ filterModal: false})} style={{alignSelf:'flex-end', fontSize: 20}}>X</Text>
                <Text>Text</Text>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={[styles.button, styles.btn]}
                >
                  <Text style={{ width: '100%', textAlign: "center", color: 'white'}}>Применить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Container>
    )
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  filterModal: {
    width: 10,
    height: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTop: {
    backgroundColor: '#1a192a',
  },
  textName: {
    fontSize: 14,
    color: '#5e6064',
    fontWeight: '700',
    paddingBottom: 5,
  },
  textSpecialty: {
    fontSize: 10,
    color: '#5e6064',
    fontWeight: '300'
  },
  starContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingText: {
    color: 'red',
    fontSize: 12,
    fontWeight: '300',
    marginLeft: 10
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  button: {
    borderRadius: 10,
    margin: 3,
    borderColor: '#54bb87'
  },
  btn: {
    backgroundColor: '#54bb87',
    borderWidth: 0,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  textStyle: {
    paddingVertical: 5
  },

  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: "center",
  },
  modalView: {
    width: ScreenWidth,
    height: ScreenHeight,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: 100
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },

  textAreaContainer: {
    width: ScreenWidth - 20,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 5,
    marginBottom: 20
  },
  textArea: {
    height: 65,
    width: '100%',
    padding: 5,
    textAlignVertical: "top",
    justifyContent: "flex-start",
    borderWidth: 1
  },
  contactInput: {
    borderWidth: 1,
    width: '100%',
    padding: 5,
  },

  contactContainer: {
    width: ScreenWidth - 20,
    borderColor: 'grey',
    borderWidth: 1,
    padding: 5,
    marginBottom: 20
  }
})
