import React from "react";
import {
    Header,
    Title,
    Left,
    Right,
    Body,
    Toast,
    Spinner,
    ListItem,
    Text,
    List,
    Content, Root
} from 'native-base';
import StarRating from "react-native-star-rating";
import {AntDesign, FontAwesome, FontAwesome5, Ionicons} from '@expo/vector-icons';
import {Button} from "react-native-paper";
import axios from 'axios';
import * as _ from 'lodash';
import {
    Alert,
    AsyncStorage,
    StyleSheet,
    RefreshControl,
    Modal,
    View,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    ScrollView
} from "react-native";

import { API, getToken } from '../constants';
import { isNotUndefined } from '../helpers';
import moment from "moment";

class PriemFormList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            user: {},
            list: [],
            listGrade: [],
            sortBy: 'desc',
            refreshing: false,
            modalVisible: false,
            modalReportVisible: false,
            modalValue: [],
            callPhone: '',
            ratingSet: 0,
            dataJson: '',
            shed_id: '',
            doc_id: ''
        };
    }

    _getUserData = () => {
        AsyncStorage.getItem('user_data').then((value) => {
            if (value) {
                const obj = JSON.parse(value);
                this.setState({ user: obj });
            }
        });
    };

    _getList = async () => {
        try {
            await getToken().then(itoken => {
                this.setState({ token: itoken });
            });
        } catch (error) {
            Toast.show({
                text: error,
                type: "danger"
            });
        }

        const API_URL = `${API}backend/get_shedul_data`;
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
            if (responseJson !== null) {
                var data = responseJson;

                if(data.success == false){
                    Toast.show({
                        text: data.message,
                        type: 'danger'
                    });
                    return;
                }

                this.setState({ list: data.result });
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }

        this.setState({refreshing: false});
    }

    getSort = (list) => {
        const sortedList = _.sortBy(list, (data) =>
            moment(data.date_visit, 'DD/MM/YYYY hh:mm:ss')
        );

        return this.state.sortBy === 'desc' ? _.reverse(sortedList) : sortedList;
    };

    handleSortBy = () => {
        this.setState(
            {
                sortBy: this.state.sortBy === 'desc' ? 'asc' : 'desc',
            },
            () => {
                this.setState({
                    list: this.getSort(this.state.list)
                });

            }
        );
    };

    getPriemForm = () => {
        this.props.navigation.navigate('PriemForm');
    }

    getGradeForm = (shed_id) => {
        this.setState({modalVisible: false})
        this.props.navigation.navigate('GradeForm', {
            shed_id: this.state.shed_id,
            docid: this.state.doc_id
        });
    }

    getPriemChat = () => {
        this.props.navigation.navigate('PriemChat', {
            roomUrl: this.state.modalValue.online_url
        });
    }

    _refreshPage = () => {
        this.setState({refreshing: true});
        this._getUserData();
        this._getList();
    }

    UNSAFE_componentWillMount() {
        this._refreshPage();
    }

    alertShow = async (shed_id) => {
        Alert.alert(
            "",
            "Вы уверены, что хотите отменить запись на прием?",
            [
              {
                text: "Нет",
                style: "cancel"
              },
              { text: "Да", onPress: () => {
                  this.onCancelPriemPressed(shed_id);
                }
              }
            ],
            { cancelable: true }
        );
      }

    _getUrl = async (url) => {
        const API_URL = `${API}backend/${url}`

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
            if (responseJson !== null) {
                if(responseJson.success == false){
                    Toast.show({
                        text: responseJson.message,
                        type: 'danger',
                        duration: 3000
                    });
                    return null;
                }
                return responseJson.result;
            }
        } catch (error) {
            console.log('Error when call API: ' + error.message);
        }
        return null;
    }

    onInfoButtonClicked = async (docid, shed_id) => {
        console.log('onInfoButtonClicked');
        console.log(docid);
        console.log(shed_id);
        this.setState({ shed_id: shed_id, doc_id: docid });
        await this._getUrl('get_grade_for_visit/'+shed_id).then(value => {
            this.setState({ listGrade: value, activeDoc: docid, modalVisible: true });
        })
    }

    onCancelPriemPressed = (shed_id) => {
        let config = {
            headers: {
                Accept: 'application/json',
                'token': this.state.token,
            },
        }
        let API_URL = `${API}backend/ambTalonReceptionSave`
        let body = {
            h: 'ast2',
            i: shed_id,
            online: 0,
            oper_type: 0
        }
        axios.post(API_URL, body, config).then(res => {
            if(res.data.success){
                this.setState({refreshing: true});
                this._getList();
            }
        }).catch(err => console.log('Priem calcelling error: ', err))
    }

    _getDoctorList = async () => {
        await this._getUrl('get_shedul_data').then(value => {
            if(value !== null){
                this.setState({ list: value});
                this.setState({ filteredList: value});
            }
        })
    }

    _setRetviewForVisit = async () => {
        let API_URL = `${API}backend/set_grade_for_visit`;
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
                    'token': this.state.token,
                },
                body: `id_doctor=${this.state.doc_id}&grade=${this.state.ratingSet}&note=${this.state.otziv}&feedback=${this.state.callPhone}&shed_id=${this.state.shed_id}`,
            });

            const responseJson = await response.json();
            if (responseJson !== null) {
                let itype = 'success';

                if(responseJson.success == false){
                    itype = 'danger';
                }
                this.setState({activeDoc: null, modal: false, otziv: '', callPhone: '', ratingSet: 0, modalReportVisible: false });
                this._getDoctorList();
                this._alert(responseJson.message, responseJson.success);
                let tType = "success";
                if(responseJson.success == false){
                    tType = "danger";
                }
            }
        } catch (error) {
            this._alert("Ошибка отправки данных. Повторите еще раз");
        }
    }

    render() {
        return (
            <Content
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._refreshPage}
                    />
                }
            >
                <Header style={styles.headerTop}>
                    <Left style={{flex: 1}}>
                        <Ionicons
                            name="ios-menu"
                            style={{color: '#046475', marginLeft: 10}}
                            onPress={() => this.props.navigation.openDrawer()}
                            size={24}
                        />
                    </Left>
                    <Body style={{flex: 3}}>
                        <Title style={{color: '#046475', fontSize: 20}}>
                            Мои записи
                        </Title>
                    </Body>
                    <Right>
                        <AntDesign
                            name="pluscircle"
                            size={24}
                            color="#046475"
                            style={{marginRight: 10}}
                            onPress={() => this.getPriemForm()}
                        />
                    </Right>
                </Header>
                {this.state.refreshing ? (
                    <Text style={{ textAlign: "center", fontSize: 14, flex: 1, marginTop: 20, width: '100%' }}>Подождите идет загрузка данных</Text>
                ) : (
                    <List>
                        <ListItem>
                            <Ionicons
                                name="ios-person"
                                style={{ fontSize: 40, paddingVertical: 5 }}
                            />
                            <Body style={{ paddingLeft: 10 }}>
                                <Text style={{ fontSize: 20, paddingVertical: 5 }}>
                                    {isNotUndefined(this.state.user.fname) || 'АЛИМКУЛОВ'}{' '}
                                    {isNotUndefined(this.state.user.sname) || 'КАДЫР'}
                                </Text>
                                <Text style={{ fontSize: 12 }} note>
                                    {isNotUndefined(this.state.user.bday) || '01.01.1949'}
                                </Text>
                                <Text style={{ fontSize: 12 }} note>
                                    {isNotUndefined(this.state.user.iin) || '490101300712'}
                                </Text>
                            </Body>
                        </ListItem>
                        <ListItem>
                            <Button
                                icon={
                                    this.state.sortBy === 'desc' ? 'chevron-down' : 'chevron-up'
                                }
                                onPress={this.handleSortBy}>
                                Сортировать по дате
                            </Button>
                        </ListItem>

                        {this.state.list.map((value, i) => (
                            <ListItem
                                avatar
                                key={i}
                                style={{ paddingBottom: 5, paddingTop: 5 }}
                                onPress={() => {
                                    this.setState({ modalValue: value, modalVisible: true, shed_id: value.shed_id, doc_id: value.doc_id});
                                    this.onInfoButtonClicked(value.doc_id, value.shed_id);
                                }}
                            >
                                <Left>
                                    {value.is_online == 1 ? (
                                        <FontAwesome name="video-camera" size={24} color="black" />
                                    ) : (
                                        <FontAwesome5 name="clinic-medical" size={24} color="black" />
                                    )}
                                </Left>
                                <Body>
                                    <Text style={{ fontSize: 12 }}>{ value.spr_value }</Text>
                                    <Text numberOfLines={1}>{ value.fio }</Text>
                                    <Text style={{ fontSize: 12 }} note>{value.date_visit}</Text>
                                </Body>
                                {moment(value.date_visit, 'DD/MM/YYYY HH:mm:ss') > new Date() && <Right>
                                    <Button
                                        transparent
                                        onPress={() => this.alertShow(value.shed_id)}
                                        >
                                        <Text style={styles.cancelButton}>Отменить</Text>
                                    </Button>
                                </Right>}
                            </ListItem>
                        ))}
                    </List>
                    )
                }
                <Modal
                    visible={this.state.modalVisible}
                >
                    <SafeAreaView>
                    <View style={styles.modalView}>
                        <Text style={{ marginVertical: 10 }}>Вид приема: {this.state.modalValue.is_online == 1 ? 'Онлайн консультация' : 'Консультация в медицинской организации'}</Text>
                        <Text style={{ marginVertical: 10 }}>Специальность: {this.state.modalValue.spr_value}</Text>
                        <Text style={{ marginVertical: 10 }}>Врач: {this.state.modalValue.fio}</Text>
                        <Text style={{ marginVertical: 10 }}>Кабинет: {this.state.modalValue.cab_num}</Text>
                        <Text style={{ marginVertical: 10 }}>Дата и время приема: {this.state.modalValue.date_visit}</Text>
                        {
                            this.state.modalValue.is_online == 1 ? (
                            <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#489ce7", marginBottom: 20, marginTop: 30 }}
                            onPress={() => {
                                let visitDate = moment(this.state.modalValue.date_visit, 'DD-MM-YYYY HH:mm:ss Z')
                                let currentDate = new Date();
                                if((currentDate - visitDate) > 10 * 60 * 1000) {
                                    this.setState({ modalVisible: false});
                                    Toast.show({
                                    text: 'Вы опоздали на прием более чем на 10 минут, онлайн консультация недоступна',
                                    type: 'warning',
                                    duration: 4000,
                                  })}
                                  else
                                {
                                    this.setState({ modalVisible: false});
                                    this.getPriemChat();
                                }
                            }}
                            >
                            <Text style={styles.textStyle}>Начать конференцию</Text>
                            </TouchableOpacity>
                            ) : (
                                <Text></Text>
                            )
                        }
                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#01A19F", marginTop: 20, }}
                            // onPress={() =>
                            //     {
                            //         this.setState({ modalReportVisible: true, modalVisible: false})
                            //     }
                            // }
                            onPress=
                            {
                                () => this.getGradeForm(this.shed_id)
                            }
                        >
                            <Text style={styles.textStyle}>Добавить отзыв</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ ...styles.openButton, backgroundColor: "#01A19F", marginTop: 20, }}
                            onPress={() => {this.setState({ modalVisible: false})}}
                        >
                            <Text style={styles.textStyle}>Назад</Text>
                        </TouchableOpacity>
                    </View>
                    </SafeAreaView>
                </Modal>
                <Modal
                    animationType={"slide"}
                    visible={this.state.modalReportVisible}
                >
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>
                            <ScrollView style={{ paddingTop: 40 }}>
                                <List>
                                    {this.state.listGrade.map((grade, i) => (
                                        <ListItem key={i} style={{ flexDirection: 'column', alignItems: "flex-start" }}>
                                            <View>
                                                <Text>{grade.note}</Text>
                                            </View>
                                            <View>
                                                {grade.reason != null?
                                                    <Text style={{
                                                        color: 'red',
                                                        textAlign: "left"
                                                    }}>Отклонен модератором. Причина:{"\n"}{grade.reason}</Text>
                                                    : null }
                                            </View>
                                            <View style={{ width: '100%' }}>
                                                <Text style={{ width: '100%', textAlign: "right", fontSize: 10 }}>{grade.grade_date}</Text>
                                            </View>
                                        </ListItem>
                                    ))}
                                </List>
                            </ScrollView>
                            <View style={{ borderTopWidth: 1,}}>
                                <List>
                                    <ListItem noBorder>
                                        <TextInput
                                            style={styles.textArea}
                                            underlineColorAndroid="transparent"
                                            placeholder="Введите отзыв"
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
                                            placeholder="Как с вами связаться? (Телефон или электронную почту)"
                                            placeholderTextColor="grey"
                                            onChangeText={text => this.setState({callPhone: text})}
                                        />
                                    </ListItem>
                                    <ListItem noBorder style={{ marginTop: -20, flexDirection: 'column', }}>
                                        <Text>Оцените врача по пятибалльной шкале</Text>
                                        <StarRating
                                            maxStars={5}
                                            emptyStar={'ios-star-outline'}
                                            fullStar={'ios-star'}
                                            halfStar={'ios-star-half'}
                                            iconSet={'Ionicons'}
                                            rating={this.state.ratingSet}
                                            starSize={30}
                                            selectedStar={(rating) => this.setState({ratingSet: rating})}
                                            fullStarColor={'red'}
                                            emptyStarColor={'red'}
                                            interitemSpacing={20}
                                        />
                                    </ListItem>
                                </List>
                                <List>
                                    <ListItem>
                                        <Left>
                                            <Button
                                                success={true}
                                                style={{
                                                    width: '90%',
                                                    borderRadius: 10,
                                                    backgroundColor: '#5cb85c',}}
                                                onPress={() => {
                                                    this.setState({modalReportVisible: false});
                                                }}
                                            >
                                                <Text style={{ width: '100%', textAlign: "center", color: 'white'}}>Закрыть</Text>
                                            </Button>
                                        </Left>
                                        <Body>
                                            <Button
                                                style={{
                                                    width: '90%',
                                                    borderRadius: 10,
                                                    backgroundColor: '#007aff',}}
                                                onPress={() => {
                                                    this._setRetviewForVisit()
                                                }}
                                            >
                                                <Text style={{ width: '100%', textAlign: "center", color: 'white'}}>Отправить</Text>
                                            </Button>
                                        </Body>
                                    </ListItem>
                                </List>
                            </View>
                        </View>
                </Modal>
            </Content>
        );
    }
};

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
    cancelButton: {
        color: 'red',
        fontSize: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
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
    modalView: {
        margin: 10,
    },
    contactInput: {
        borderWidth: 1,
        width: '100%',
        padding: 5,
    },
    textArea: {
        height: 65,
        width: '100%',
        padding: 5,
        textAlignVertical: "top",
        justifyContent: "flex-start",
        borderWidth: 1
    },
});

export  default PriemFormList;
