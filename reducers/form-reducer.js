import { SET_INFO, RESET_INFO } from '../actions/form-actions';
import { SPEC_TYPE, DOCTOR, DATE_T, TIME_T, TIMES_T, SHED_ID_T } from '../screens/constants';
import moment from 'moment';
import 'moment/locale/ru';

const initialState = {
  user: {
    name: '',
  },
  specType: {},
  doctor: {},
  date: [],
  time: '',
  times: [],
  shedId: '',
};

export const formReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_INFO:
      let newState = { ...state };
      switch (payload.type) {
        case SPEC_TYPE:
          newState.specType = payload.data;
          newState.doctor = {};
          newState.date = [];
          newState.time = '';
          newState.times = [];
          newState.shedId = '';
          break;
        case DOCTOR:
          newState.doctor = payload.data;
          newState.date = moment().toISOString();
          newState.time = '';
          newState.times = [];
          newState.shedId = '';
          newState.shedule = [];
          break;
        case DATE_T:
          newState.date = payload.data;
          newState.time = '';
          newState.times = [];
          newState.shedId = '';
          break;
        case TIMES_T:
          newState.times = payload.data;
          newState.time = '';
          newState.shedId = '';
          break;
        case TIME_T:
          newState.time = payload.data;
          break;
        case SHED_ID_T:
          newState.shedId = payload.data;
          break;
        default:
          newState[payload.type] = payload.data;
          break;
      }
      return newState;
    case RESET_INFO:
      return initialState;
    default:
      return state;
  }
};
