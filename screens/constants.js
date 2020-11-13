export const API = 'https://bmc-api.bmcudp.kz/'; //Production
//export const API = 'https://bmc-api-dev.bmcudp.kz/'; //Test

//export const WsAPI = 'wss://rtc-chat.bmcudp.kz:443';
export const WsAPI = 'wss://rtc-chat-dev.bmcudp.kz:443';
//export const WsAPILocal = 'ws://10.10.70.61:8081';


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
