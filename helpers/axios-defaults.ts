import axios from 'axios';

//axios.defaults.baseURL = 'https://bmc-api.bmcudp.kz/backend';
axios.defaults.baseURL = 'https://bmc-api-dev.bmcudp.kz/backend';
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
