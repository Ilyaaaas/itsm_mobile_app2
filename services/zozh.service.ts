import axios from 'axios';

import { BaseBackendDataInterface } from '../types/base-backend-data.interface';
import { HealthyLifestyleInterface } from '../types/healthy-lifestyle.interface';

export const zozhService = { get };

interface GetZozhData extends BaseBackendDataInterface {
  result: HealthyLifestyleInterface[];
}
async function get() {
  const { data } = await axios.get<GetZozhData>('zosh');
  return data;
}
