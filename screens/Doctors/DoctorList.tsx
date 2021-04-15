import React from "react";
import {
    Dimensions,
    Modal,
    RefreshControl,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ScrollView
} from "react-native";
import {
    Body,
    Container,
    Content,
    Header,
    Left,
    List,
    ListItem,
    Right,
    Title,
    Text,
    Toast,
    Input,
    Icon,
    Button, Root,
} from "native-base";
import { API, getToken } from '../constants';
import {Ionicons} from "@expo/vector-icons";
import StarRating from "react-native-star-rating";

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;

class DoctorList extends React.Component{
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
        }
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

    _getDoctorList = async () => {
        await this._getUrl('get_doctors').then(value => {
            if(value !== null){
                this.setState({ list: value});
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
        await this._getUrl('get_grade/'+docid).then(value => {
            this.setState({ listGrade: value, activeDoc: docid, modal: true });
        })
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
            console.log(`id_doctor=${this.state.activeDoc}&grade=${this.state.ratingSet}&note=${this.state.otziv}&feedback=${this.state.callPhone}`);
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
        return (
            <Container>
                <Root>
                <Header style={styles.headerTop}>
                    <Left style={{ flex: 1}}>
                        <Ionicons name="ios-menu"
                                  style={{ color: '#046475', marginLeft: 10 }}
                                  onPress={() => this.props.navigation.openDrawer()}
                                  size={24}
                        />
                    </Left>
                    <Body style={{ flex: 3 }}>
                        <Title style={{ color: '#046475' }}>Наши врачи</Title>
                    </Body>
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
                                            <Text style={styles.textName}>{doc.fio}</Text>
                                            <View style={styles.starContainer}>
                                                <Text style={styles.textSpecialty}>{doc.spr_value}</Text>
                                            </View>
                                            <View style={styles.buttonsContainer}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={[styles.button, styles.btn]}
                                                    onPress={() => this._onReviewButtonClicked(i)}
                                                >
                                                    <Text style={{ color: '#fff' }}>О враче</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    style={[styles.button, styles.btn]}
                                                    onPress={() => this.onInfoButtonClicked(doc.doc_id)}
                                                >
                                                    <Text style={{ color: '#fff' }}>Отзывы</Text>
                                                </TouchableOpacity>
                                            </View>
                                            {this.state.isDocReviewSelected == i &&
                                            <View style={{ marginBottom: 10, marginTop: 10 }}>
                                                <Text style={styles.textSpecialty}>Категория: { doc.category_name || "" }</Text>
                                                <Text style={styles.textSpecialty}>Ученая степень: {doc.science_degree}</Text>
                                            </View>
                                            }
                                        </Body>
                                        <Right>
                                            <View style={styles.starContainer}>
                                                <StarRating
                                                    disabled={true}
                                                    maxStars={5}
                                                    rating={parseInt(doc.avg_grade)}
                                                    emptyStar={'ios-star-outline'}
                                                    fullStar={'ios-star'}
                                                    halfStar={'ios-star-half'}
                                                    iconSet={'Ionicons'}
                                                    starSize={15}
                                                    fullStarColor={'red'}
                                                    emptyStarColor={'red'}
                                                />
                                                <Text style={styles.ratingText}>{doc.avg_grade}</Text>
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
                                                <Text style={{ width: '100%', textAlign: "center"}}>Отправить</Text>
                                            </Button>
                                        </Body>
                                    </ListItem>
                                </List>
                            </View>
                        </View>
                    </Root>
                </Modal>
            </Container>
        )
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
    textName: {
        fontSize: 14,
        color: '#046475',
        fontWeight: '700',
        paddingBottom: 5,
    },
    textSpecialty: {
        fontSize: 10,
        color: '#046475',
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
        borderColor: '#01A19F'
    },
    btn: {
        backgroundColor: '#01A19F',
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

export default DoctorList;
