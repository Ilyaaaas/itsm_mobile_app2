import {AntDesign, Ionicons, MaterialIcons} from '@expo/vector-icons';
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
  Toast, Root, Button, Tab, TabHeading, Tabs,
} from 'native-base';
import React, {useEffect} from 'react';
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
  Dimensions, AppState
} from 'react-native';
import * as Location from 'expo-location';
import Main from './Main';
import { isNotUndefined } from './helpers';
import {API, getToken} from './constants';
import StarRating from "react-native-star-rating";
import {WebView} from "react-native-webview";
import DropDownPicker from "react-native-dropdown-picker";
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DiaryScreenView from "./Diary/DiaryScreenView";
import {DataTable} from "react-native-paper";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

const numberOfItemsPerPageList = [2, 3, 4];

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
      dataDocStatusId: 0,
      dataDocId: 0,
      author_name: '',
      created_at: '',
      company_name: '',
      user: {
        fname: '',
        sname: '',
        section_txt: '',
      },
      currentPage: 0,
      prevPage: 0,
      firstPage: 0,
      lastPage: 0,
      totalPage: 0,
      totalReqCount: 0,
      reqCountInOnePage: 0,
      currentPageLink: '',
    }
  }

  _getUrl = async (url) => {
    const API_URL = API+url;
    console.log(API_URL);

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': this.state.token,
        },
      });

      const responseJson = await response.json();
      console.log('responseJson');
      console.log(responseJson);
      return responseJson;
      // if (responseJson !== null) {
      //   if(responseJson.success == false){
      //     Toast.show({
      //       text: responseJson.message,
      //       type: 'danger',
      //       duration: 3000
      //     });
      //     return null;
      //   }
      //   return responseJson.result;
      // }
    } catch (error) {
      console.log('Error when call API: ' + error.message);
    }
    return null;
  }

  _getDoctorList = async () => {
    console.log(this.state.token)
    await this._getUrl('service-requests/v1/request?access-token='+this.state.token+'&_format=json&expand=status,product,type&sort=-id')
      .then(value => {
        if(value !== null){
          this.setState({
                                list: value.items,
                                currentPage: value._links.self.href,
                                // prevPage: value._links.prev.href,
                                nextPage: value._links.next.href,
                                firstPage: value._links.first.href,
                                lastPage: value._links.last.href,
                                totalPage: value._meta.pageCount,
                                totalReqCount: value._meta.totalCount,
                                reqCountInOnePage: value._meta.perPage,
                        });
          console.log('value._meta');
          console.log(value._meta.totalCount);
          console.log(value._links);
        }
      }
    )
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
    await AsyncStorage.getItem('accessToken').then(req => JSON.parse(req))
        .then(json => this.setState({token: json[0].accessToken}))
        // .then(json => {
        //   return json[0].accessToken;
        // })
        .catch(error => console.log(error))
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

  searchRequest = async (searchText) =>
  {
    let data = this.state.filteredList;
    data = data.filter(function(item){
      return item.fio.includes(searchText.text.toUpperCase());
    }).map(function({avg_grade, category_name, doc_id, fio, fname, lname, rnum, science_degree, sname, spr_value}){
      return {avg_grade, category_name, doc_id, fio, fname, lname, rnum, science_degree, sname, spr_value};
    });
    this.setState({ list: data});
  }

  _setRetview = async () => {
    let API_URL = `${API}backend/set_grade`
    let showToast = false;
    let msgToast = '';
    /*
    if(this.state.otziv == ''){
        showToast = true;
        msgToast = 'Пустой текст сообщения';
    }
    if(this.state.callPhone == ''){
        showToast = true;
        msgToast = 'Пустой текст обратной связи';
    }
     */
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
          'token': this.state.token,
        },
        body: `id_doctor=${this.state.activeDoc}&grade=${this.state.ratingSet}&note=${this.state.otziv}&feedback=${this.state.callPhone}`,
      });

      const responseJson = await response.json();
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
      this._alert("Ошибка отправки данных. Повторите еще раз");
    }
  }

  onInfoButtonClicked = async (docid) => {
    await this._getUrl('service-requests/v1/request/'+docid+'?expand=clientUser').then(value => {
      this.setState({
        listGrade: value,
        activeDoc: docid,
        modal: true,
        author_name: value.clientUser.person_name,
        created_at: value.clientUser.created_at,
        company_name: value.clientUser.company_name,
      });
    })
  }

  goToCreateReq = () => {
    this.props.navigation.navigate('OfferScreen');
  }

  showFilter = () => {
    this.setState({ filterModal: true});
  }

  render() {
    {console.log('this.state.list')}
    {console.log(this.state.list)}
    return (
        <Container>
          <Root>
            <Header style={styles.headerTop}>
              <Left>
              </Left>
              <Body style={{ flex: 3 }}>
                <Title style={{ color: '#1a192a' }}>Мои заявки</Title>
              </Body>
              <Right>
                <AntDesign
                    name="pluscircleo"
                    size={24}
                    color="#1a192a"
                    style={{marginRight: 10}}
                    onPress={() => this.goToCreateReq()}
                />
                <AntDesign
                    name="filter"
                    size={24}
                    color="#1a192a"
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
              <View>
                <TextInput
                    style={styles.textInput}
                    placeholder="Поиск"
                    onChangeText={text => this.searchRequest({text})}
                />
              </View>
              {this.state.refreshing ? (
                  <Text style={{ textAlign: "center", fontSize: 14, flex: 1, marginTop: 20, width: '100%' }}>Подождите идет загрузка данных</Text>
              ) : (
                  <List>
                    {this.state.list.map((doc, i) => (
                        <ListItem key={i} style={{ paddingBottom: 5, paddingTop: 15 }}>
                          <Body>
                            <Text style={styles.textSpecialty}>№: { doc.id }</Text>
                            <Text style={styles.textSpecialty}>{ doc.createdAt }</Text>

                            <Text style={styles.textName}>{doc.descr}</Text>
                            <View style={styles.starContainer}>
                              <Text style={styles.textSpecialty}>{doc.spr_value}</Text>
                            </View>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                // style={[styles.button, styles.btn]}
                                onPress={() => this._onReviewButtonClicked(i)}
                            >
                              <AntDesign
                                  name="down"
                                  size={24}
                                  color={doc.status.color_class}
                                  style={{marginRight: 10}}
                              />
                              {/*<Text style={{ color: '#fff' }}>Подробнее</Text>*/}
                            </TouchableOpacity>
                            {this.state.isDocReviewSelected == i &&
                            <View style={{ marginBottom: 10, marginTop: 10 }}>
                              <Text style={styles.textSpecialty}>Дата: { doc.category_name || "" }</Text>
                              <Text style={styles.textSpecialty}>Описание: {doc.descr}</Text>
                              <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    style={[styles.button, styles.btn]}
                                    onPress={() => this.onInfoButtonClicked(doc.id)}
                                >
                                  <Text style={{ color: '#fff' }}>Сменить статус</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                            }
                          </Body>
                          <Right>
                            <Text style={styles.textSpecialtyDanger}>18.07.2021</Text>
                            <View style={{ marginBottom: 10, marginTop: 10 }}>
                              {doc.status.colorClass == 'success' ?
                                  <MaterialIcons name="done" size={24} color="black" />
                                  :
                                  null
                              }
                              {/*{doc.status.colorClass == 'info' ?*/}
                              <AntDesign
                                  name="warning"
                                  size={24}
                                  style={{marginRight: 10, color: '#17a2b8'}}
                                  onPress={() => this.getPriemForm()}
                              />
                              {/*    :*/}
                              {/*    null*/}
                              {/*}*/}
                              <Text style={styles.textSpecialty}>{doc.status.name}</Text>
                            </View>
                          </Right>
                        </ListItem>
                    ))}
                  </List>
              )}
            </Content>
            <View style={{alignItems: 'center', flexDirection: 'column', backgroundColor: '#1a192a'}}>
              <Text style={{color: 'white'}}>Показано {this.state.reqCountInOnePage} из {this.state.totalReqCount} заявок</Text>
            </View>
            <Footer style={{
                              backgroundColor: 'white',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                          }}>
              <View style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                              width: 70,
                              justifyContent: 'space-between',
                              paddingLeft: 10,
                          }}>
                <AntDesign name="verticleright" size={20} color='#5e6064' />
                <AntDesign name="left" size={24} color='#5e6064'/>
              </View>
              <Body style={{justifyContent: 'center', alignItems: 'center', marginLeft: 5, marginRight: 5, width: 200}}>
                <TouchableOpacity style={{borderWidth: 1, borderRadius: 20, padding: 10, borderColor: 'black', margin: 5}}>
                  <Text>1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderWidth: 1, borderRadius: 20, padding: 10, borderColor: 'black', margin: 5}}>
                  <Text>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderWidth: 1, borderRadius: 20, padding: 10, borderColor: 'black', margin: 5}}>
                  <Text>3</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{borderWidth: 1, borderRadius: 20, padding: 10, borderColor: 'black', margin: 5}}>
                  <Text>4</Text>
                </TouchableOpacity>
              </Body>
              <View style={{
                            width: 70,
                            backgroundColor: 'white',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingRight: 10,
                          }}>
                <AntDesign name="right" size={24} color='#5e6064' />
                <AntDesign name="verticleleft" size={20} color='#5e6064' />
              </View>
            </Footer>
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
                  <ListItem>
                    <Ionicons
                        name="ios-person"
                        style={{ fontSize: 40, paddingVertical: 5 }}
                    />
                    <Body style={{ paddingLeft: 10 }}>
                      <Text style={{ fontSize: 20, paddingVertical: 5 }}>
                        {this.state.author_name}
                      </Text>
                      <Text style={{ fontSize: 12 }}>
                        {this.state.company_name}
                      </Text>
                      <Text style={{ fontSize: 12 }}>
                        {this.state.created_at}
                      </Text>
                    </Body>
                  </ListItem>
                  <View>
                    <Tabs style={{backgroundColor: '#fff'}}>
                      <Tab style={{backgroundColor: '#fff'}} heading={
                        <TabHeading>
                          <Text>Инфо</Text>
                        </TabHeading>
                      }>
                        <List>
                          <ListItem key={1}>
                            <View>
                              <Text style={styles.textName}>Заголовок: </Text>
                              <Text>{this.state.listGrade.title}</Text>
                            </View>
                            <View>
                              <Text style={styles.textName}>Описание: </Text>
                              <Text>{this.state.listGrade.descr}</Text>
                            </View>
                            <View>
                              <Text style={styles.textName}>Дата создания: </Text>
                              <Text>{this.state.listGrade.createdAt}</Text>
                            </View>
                          </ListItem>
                        </List>
                      </Tab>
                      <Tab heading={
                        <TabHeading>
                          <Text>Журнал</Text>
                        </TabHeading>
                      }>
                        <List>
                          <ListItem key={2}>
                            <View style={{ flexDirection: "column" }}>
                              <Text style={{ fontSize: 16 }}>Test</Text>
                              <Text style={{ fontSize: 12, marginTop: 5, color: '#6f6f6f' }}>date</Text>
                            </View>
                          </ListItem>
                        </List>
                      </Tab>
                      <Tab heading={
                        <TabHeading>
                          <Text>Комментарии</Text>
                        </TabHeading>
                      }>
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
                      </Tab>
                    </Tabs>
                  </View>
                </ScrollView>
                <View style={{ borderTopWidth: 1,}}>
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
                        {this.state.listGrade.statusId == 13 ?
                            <Button
                                block
                                onPress={() => this.acceptRequest(this.state.listGrade.id)}
                                style={{backgroundColor: 'green'}}
                            >
                              <Text>Начать исполнение</Text>
                            </Button>
                            : null }
                        {this.state.listGrade.statusId == 2 ?
                            <Button
                                block
                                onPress={() => this.closeRequest(this.state.listGrade.id)}
                                style={{backgroundColor: 'red'}}
                            >
                              <Text>Завершить исполнение</Text>
                            </Button>
                            : null }
                      </Body>
                    </ListItem>
                  </List>
                </View>
              </View>
            </Root>
          </Modal>
          <Modal
              animationType={"fade"}
              style={{backgroundColor: 'black'}}
              transparent={true}
              visible={this.state.filterModal}
              contentContainerStyle={styles.filterModal}
              onRequestClose={()=>this.setState({ filterModal: false})}>
            <View style={{
              backgroundColor: 'rgba(30, 30, 45, 0.8)',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'}}>
              <View style={{
                backgroundColor: 'white',
                width: 350,
                height: 300,
                borderRadius: 10,
              }}>
                <Text onPress={()=>this.setState({ filterModal: false})} style={{alignSelf:'flex-end', fontSize: 20}}>
                  <MaterialIcons
                      name="close"
                      size={34}
                      color="#1a192a"
                      style={{ marginRight: 10 }}
                  />
                </Text>
                <DropDownPicker
                    items={[
                      {label: 'Новые заявки', value: 0},
                      {label: 'Требуют исполнения', value: 1},
                      {label: 'Назначенные мне', value: 2},
                      {label: 'Созданные мной', value: 3},
                      {label: 'Назначенные на группу', value: 4},
                      {label: 'Требуют внимания', value: 5},
                      {label: 'Акуатльные инценденты', value: 6},
                      {label: 'Инценденты', value: 7},
                    ]}
                    containerStyle={{height: 40}}
                    onChangeItem={() => alert('Filter')}
                />
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

const styles = StyleSheet.create({
  danger: {
    color: '#ff1016'
  },
  info: {
    color: '#445aff'
  },
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
    backgroundColor: '#fff',
    borderColor: '#898989',
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
  textSpecialtyDanger: {
    fontSize: 10,
    color: '#5e6064',
    fontWeight: '300',
    backgroundColor: '#fd397a',
    borderRadius: 10,
    paddingRight: 4,
    paddingLeft: 4,
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
  },
  textInput:
      {
        fontSize: 14,
        backgroundColor: '#fff',
        color: '#1a192a',
        padding: 5,
        height: 40,
        borderColor: '#898989',
        borderWidth: 0.5,
        textTransform: 'uppercase',
      }
})

export default HomeScreen;
