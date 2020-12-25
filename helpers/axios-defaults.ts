import axios from 'axios';
import {API} from '../screens/constants';

//axios.defaults.baseURL = 'https://bmc-api.bmcudp.kz/backend';
axios.defaults.baseURL = `${API}backend`; //'https://bmc-api-dev.bmcudp.kz/backend';
axios.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded';
