import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {View, StyleSheet, AsyncStorage, Picker} from 'react-native';
import 'moment/locale/ru';
import CalendarStrip from 'react-native-calendar-strip';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  FooterTab,
  Footer,
  Toast,
} from 'native-base';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Notifications from "expo-notifications";

import { resetFormInfo, setFormInfo } from '../../actions/form-actions';
import { isEmpty, DATE_T, SHED_ID_T, TIME_T, TIMES_T, API } from '../constants';

import { Ionicons } from '@expo/vector-icons';

const CHOOSE_SPEC = 'choose-spec',
  CHOOSE_DOCTOR = 'choose-doctor';

const datesWhitelistEmpty = [];

const datesBlacklistEmpty = [],
  datesBlacklist = []; // 1 day disabled

const locale = {
  name: 'ru',
  config: {
    months: 'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split(
      '_'
    ),
    monthsParseExact: true,
    weekdays: 'Воскресенье_Понедельник_Вторник_Среда_Четверг_Пятница_Суббота'.split(
      '_'
    ),
    weekdaysShort: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
    weekdaysMin: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
    weekdaysParseExact: true,
    meridiem(hours, minutes, isLower) {
      return hours < 12 ? 'PD' : 'MD';
    },
    week: {
      dow: 0,
    },
  },
};

export default function PriemForm({ navigation }) {
  const [token, setToken] = useState('');
  const [datesWhitelist, setDatesWhitelist] = useState([
    {
      start: moment(),
      end: moment().add(20, 'days'),
    },
  ]);

  const [openCheck, setOpenCheck] = useState(false);
  const [firstClick, setfirstClick] = useState(true);
  const [typeUrl, setTypeURL] = useState(0);
  const [vidPriem, setVidPriem] = useState('');
  const [disType, setDisType] = useState(true);
  const form = useSelector((state) => state.form);
  const { date = [], time = '', times = [], shedId = '' } = form;
  const dispatch = useDispatch();

  useEffect(() => {
    // if (!isEmpty(form.doctor)) {
    //   getLastAvailableDate();
    // }
    if (!isEmpty(form.doctor) && !isEmpty(date)) {
      setDisType(false);
      getSheduleDay();
    }
  }, [date, typeUrl]);

  useEffect(() => {
    dispatch(resetFormInfo());
    getToken();
  }, []);

  async function getToken() {
    try {
      const value = await AsyncStorage.getItem('token');

      if (value !== null) {
        const token = value.replace(/['"«»]/g, '');
        setToken(token);
      }
    } catch (error) {
      console.log('error get Token' + error);
    }
  }

  function handleChangeCalendar(dateS) {
    setfirstClick(true);
    let newD = dateS;
    if (moment(dateS).format('hh:mm') === '12:00')
      newD = moment(dateS).add(7, 'hours').toISOString();
    dispatch(setFormInfo(DATE_T, newD));
  }

  function handleChangeTime(obj) {
    setfirstClick(true);
    dispatch(setFormInfo(SHED_ID_T, obj.shed_id));
    dispatch(setFormInfo(TIME_T, obj.shedul_time));
  }

  function onPressSpec(type) {
    setfirstClick(true);
    switch (type) {
      case CHOOSE_SPEC:
        navigation.push('ChooseType');
        break;
      case CHOOSE_DOCTOR:
        navigation.push('ChooseDoctor', {
          typeId: form.specType.id,
        });
        break;
      default:
        break;
    }
  }

  async function getSheduleDay() {
    setfirstClick(true);
    const doctorId = form.doctor.doctorId;
    const datePriem = moment(date).format('DD.MM.YYYY');
    let cabinet = form.doctor.cabinet;

    form.doctor.shedule.map((item) => {
      if(item.shedule_date === datePriem){
        cabinet = item.cab_num;
      }
    });

    const API_URL = `${API}backend/getSheduleDay?h=ast2&d=-2&doc=${doctorId}&day=${datePriem}&c=${cabinet}&type_conf=${typeUrl}`;

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          token,
        },
      });

      const responseJson = await response.json();
      if (responseJson !== null) {
        var data = responseJson;

        console.log("Time data: ", data)
        if (data.length > 0) {
          const res = data.filter((item) => item.flag === '0');

          if (res.length !== 0) {
            dispatch(setFormInfo(TIMES_T, res));
          } else {
            Toast.show({
              text: 'В данной дате нет свободного времени',
              buttonText: 'Ok',
              type: 'warning',
              duration: 1000,
            });
            dispatch(setFormInfo(TIMES_T, []));
          }
        } else {
          Toast.show({
            text: 'В данной дате нет свободного времени',
            buttonText: 'Ok',
            type: 'warning',
            duration: 1000,
          });
          dispatch(setFormInfo(TIMES_T, []));
        }
      }
    } catch (error) {
      console.log('Error when call API: ' + error.message);
    }
  }



  async function getLastAvailableDate() {
    setfirstClick(true);
    const doctorId = form.doctor.doctorId;

    const API_URL = `${API}backend/getLastAvailableDate?h=ast2&d=-2&doc_id=${doctorId}`;
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          token,
        },
      });
      const responseJson = await response.json();
      if (responseJson !== null) {
        var data = responseJson;
        if (data) {
          setDatesWhitelist([
            {
              start: moment(),
              end: moment(data.last_date, 'YYYY-MM-DD').toDate(),
            },
          ]);
        } else {
          Toast.show({
            text: 'Ошибка вызова АПИ!',
            buttonText: 'Ok',
            type: 'danger',
            duration: 1000,
          });
        }
      }
    } catch (error) {
      console.log('Error when call API: ' + error.message);
    }
  }

  async function postTalon() {
    if (!shedId) return;
    try {
      setfirstClick(false);
      const API_URL = `${API}backend/ambTalonReceptionSave?h=ast2&i=${shedId}&online=${typeUrl}`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          token,
        },
      });

      const responseJson = await response.json();

      if (responseJson !== null) {
        let priemDate = new Date(date).setHours(time.split(':')[0], time.split(':')[1]);
        let dayBefore = priemDate - (1440 * 60000);
        let halfPastBefore = priemDate - (15 * 60000);
        Notifications.scheduleNotificationAsync({
          content: {
              title: 'До приема 24 часа',
              body: `Вы записаны на прием ${form.doctor.name},${form.specType.name && ` специальность ${form.specType.name},`} время начало приема ${time}, кабинет ${form.doctor.cabinet || '**'}, также вы можете отменить запись через мобильное приложение или позвонить в регистратуру на номер +7 717 270 8090`,
          },
          trigger: {
              seconds: dayBefore,
          },
      });

      Notifications.scheduleNotificationAsync({
        content: {
            title: 'До приема 15 минут',
            body: `Вы записаны на прием ${form.doctor.name},${form.specType.name && ` специальность ${form.specType.name},`} время начало приема ${time}, кабинет ${form.doctor.cabinet || '**'}, также вы можете отменить запись через мобильное приложение или позвонить в регистратуру на номер +7 717 270 8090`,
        },
        trigger: {
            seconds: halfPastBefore,
        },
    });

        var data = responseJson;
        if (data.success) {
          Toast.show({
            text: 'Успешно записались! ' + data.message,
            buttonText: 'Ok',
            type: 'success',
            duration: 7000,
          });
          navigation.goBack();
        } else {
          Toast.show({
            text: data.message,
            buttonText: 'Ok',
            type: 'danger',
            duration: 3000,
          });
        }
      }
      updateState();      
    } catch (error) {
      console.log('Error when call API : ' + error.message);
    }
  }

  function updateState() {
    setOpenCheck(false);
    dispatch(resetFormInfo());
    setDisType(true);
    setDatesWhitelist([
      {
        start: moment(),
        end: moment(), //.add(20, "days")
      },
    ]);
  }


  return (
    <Container>
      <Header style={styles.headerTop}>
        <Left style={{ flex: 1 }}>
          <Ionicons
            name="md-arrow-back"
            style={{ color: '#046475', marginLeft: 10 }}
            onPress={() => navigation.goBack()}
            size={24}
          />
        </Left>
        <Body style={{ flex: 3 }}>
          <Title style={{ color: '#046475', fontSize: 20 }}>
            Записаться на прием
          </Title>
        </Body>
        <Right />
      </Header>
      <Content style={{ paddingHorizontal: 20 }}>
        {!openCheck ? (
          <>
            <View>
              <View style={{ marginVertical: 10 }}>
                <Text>Специальность</Text>
                <ListItem onPress={() => onPressSpec(CHOOSE_SPEC)}>
                  <Left>
                    <Text>
                      {!isEmpty(form.specType) ? form.specType.name : 'Выбрать'}
                    </Text>
                  </Left>
                  <Right>
                    <Ionicons
                      name="ios-arrow-dropdown"
                      style={{ color: '#000' }}
                    />
                  </Right>
                </ListItem>
              </View>
              <View style={{ marginVertical: 10 }}>
                <Text>Врач</Text>
                {isEmpty(form.specType) ? (
                  <ListItem>
                    <Left>
                      <Text></Text>
                    </Left>
                    <Right>
                      <Ionicons name="ios-arrow-dropdown" />
                    </Right>
                  </ListItem>
                ) : (
                  <ListItem onPress={() => onPressSpec(CHOOSE_DOCTOR)}>
                    <Left>
                      <Text>
                        {!isEmpty(form.doctor) ? form.doctor.name : 'Выбрать'}
                      </Text>
                    </Left>
                    <Right>
                      <Ionicons
                        name="ios-arrow-dropdown"
                        style={{ color: '#000' }}
                      />
                    </Right>
                  </ListItem>
                )}
              </View>
              <View style={{ marginVertical: 10 }}>
                <Text style={{ marginBottom: 10 }}>Вид приема</Text>
                <DropDownPicker
                    items={[
                      {label: 'Консультация в медицинской организации', value: 0},
                      {label: 'Онлайн консультация', value: 1},
                    ]}
                    defaultValue={typeUrl}
                    disabled={disType}
                    containerStyle={{height: 40}}
                    onChangeItem={item => { setTypeURL(item.value); setVidPriem(item.label)}}
                    onClose={() => getSheduleDay()}
                />
              </View>
              <CalendarStrip
                locale={locale}
                calendarAnimation={{ type: 'sequence', duration: 30 }}
                daySelectionAnimation={{
                  type: 'border',
                  duration: 200,
                  borderWidth: 1,
                  borderHighlightColor: 'white',
                }}
                style={{
                  marginVertical: 10,
                  height: 100,
                  paddingTop: 20,
                  paddingBottom: 10,
                }}
                calendarHeaderStyle={{ color: '#000' }}
                calendarColor={'#fff'}
                dateNumberStyle={{ color: '#000' }}
                dateNameStyle={{ color: '#000' }}
                scrollable={true}
                highlightDateNumberStyle={{
                  padding: 3,
                  backgroundColor: '#01A19F',
                  color: '#fff',
                }}
                highlightDateNameStyle={{ color: '#01A19F' }}
                disabledDateNameStyle={{ color: 'grey' }}
                disabledDateNumberStyle={{ color: 'grey' }}
                datesWhitelist={
                  isEmpty(form.doctor) ? datesWhitelistEmpty : datesWhitelist
                }
                datesBlacklist={
                  isEmpty(form.doctor) ? datesBlacklistEmpty : datesBlacklist
                }
                iconContainer={{ flex: 0.1 }}
                selectedDate={date}
                onDateSelected={handleChangeCalendar}
              />
              <View
                style={{
                  flex: 1,
                  marginVertical: 10,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  padding: 5,
                  backgroundColor: '#fff',
                }}>
                {times.map((item, i) => (
                  <Button
                    rounded
                    key={i}
                    style={{
                      width: 75,
                      padding: 0,
                      margin: 3,
                      backgroundColor:
                        time === item.shedul_time ? '#F0F0F0' : '#01A19F',
                    }}
                    onPress={() => handleChangeTime(item)}>
                    <Text
                      style={{
                        margin: 0,
                        padding: 0,
                        color: time === item.shedul_time ? '#000' : '#fff',
                      }}>
                      {item.shedul_time}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>
            <Button
              block
              style={{
                marginVertical: 10,
                backgroundColor: !shedId ? '#F0F0F0' : '#01A19F',
              }}
              onPress={() => setOpenCheck(true)}
              disabled={!shedId}>
              <Text style={{ color: !shedId ? '#000' : '#F0F0F0' }}>Далее</Text>
            </Button>
          </>
        ) : (
          <RenderCheckSubmit
            form={form}
            date={new Date(date).toISOString().substring(0, 10)}
            time={time}
            postTalon={postTalon}
            cancel={() => setOpenCheck(false)}
            vid={vidPriem}
          />
        )}
      </Content>
      <Footer style={{ backgroundColor: '#047B7F', height: 30 }}>
        <FooterTab style={{ backgroundColor: '#047B7F' }}></FooterTab>
      </Footer>
    </Container>
  );
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
});

function RenderCheckSubmit({ form, date, time, postTalon, cancel, vid }) {
  return (
    <>
      <Text style={{ marginVertical: 10 }}>Вид приема: {vid}</Text>
      { () => {
        if (form.user.name.trim() !== '') {
          <Text style={{marginVertical: 10}}>{form.user.name}</Text>
        }
      }
      }
      <Text style={{ marginVertical: 10 }}>
        Специальность: {form.specType.name}
      </Text>
      <Text style={{ marginVertical: 10 }}>Врач: {form.doctor.name}</Text>
      <Text style={{ marginVertical: 10 }}>Кабинет: {form.doctor.cabinet}</Text>
      <Text style={{ marginVertical: 10 }}>
        Дата и время приема: {date} {time}
      </Text>
      <Button
        block        
        style={{ marginVertical: 10, backgroundColor: '#01A19F' }}
        onPress={postTalon}>
        <Text style={{ color: '#fff' }}>ЗАПИСАТЬСЯ</Text>
      </Button>
      <Button
        block
        style={{ marginVertical: 10, backgroundColor: '#fff' }}
        onPress={cancel}>
        <Text style={{ color: '#046475' }}>Назад</Text>
      </Button>
    </>
  );
}
