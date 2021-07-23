import {AsyncStorage} from "react-native";
import moment from "moment";

//export const API = 'https://bmc-api.bmcudp.kz/'; //Production
export const API = 'http://api.smart24.kz/service-requests/v1/'; //Test

export const WsAPI = 'wss://rtc-chat-dev.bmcudp.kz:443';
export const WsAPILocal = 'ws://10.10.70.61:8081';

export const DOCTOR = 'type:doctor';
export const SPEC_TYPE = 'type:spec-type';
export const DATE_T = 'type:date-type';
export const TIME_T = 'type:time-type';
export const TIMES_T = 'type:times-type';
export const SHED_ID_T = 'type:shed-id-type';

export function isEmpty(obj) {
  if (obj == null) return true;

  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  if (typeof obj !== 'object') return true;

  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export const setLoginPage = () => {
  AsyncStorage.removeItem('token');
};

export const timeInterval = 10;
export const timer = {
  timeStart: moment(),
  timeEnd: moment().add(timeInterval, 'minutes')
};

export async function provToken(){
  if(moment() >= timer.timeEnd){
    setLoginPage();
  }
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) return true;
    return false;
  }catch (e) {
    return false;
  }
}

export async function getToken() {
  console.log('getToken constant');
    await AsyncStorage.getItem('accessToken').then(req => JSON.parse(req))
        .then(json => console.log('accessToken2 '+json[0].accessToken))
        .then(json => {
          console.log(json[0].accessToken);
          return json[0].accessToken;
        })
        .then()
        .catch(error => console.log(error));
    console.log('getToken constant');
  return null;
}
