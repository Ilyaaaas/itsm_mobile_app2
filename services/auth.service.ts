import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Toast } from 'native-base';

import { BaseBackendDataInterface } from '../types/base-backend-data.interface';

export const authService = {
  login,
  register,
  resendCode,
  acceptCode,
  resetPassword,
};

export interface LoginParams {
  login: string;
  password: string;
  pushToken: string;
}
export type LoginData = {
  success: boolean;
  code: number;
  sessionId: string;
} & { success: boolean; code: number; message: string; details: string };
async function login(params: LoginParams): Promise<boolean> {
  try {
    const { data } = await axios.request<LoginData>({
      url: 'login',
      params,
      method: 'post',
    });

    if (!data.sessionId) {
      return false;
    }

    const { data: userData } = await axios.get('getUserData?h=ast2', {
      headers: {
        token: data.sessionId,
      },
    });

    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    await AsyncStorage.setItem('token', data.sessionId);

    return data.success;
  } catch (e) {
    Toast.show({
      text: 'Ошибка! ИИН или Пароль не найдены',
      type: 'danger',
      duration: 3000,
    });
    return false;
  }
}

export interface RegisterParams {
  iin: string;
  phone: string;
}
async function register(params: RegisterParams): Promise<boolean> {
  try {
    const { data } = await axios.request<BaseBackendDataInterface>({
      url: 'registration',
      params,
      method: 'post',
    });
    if (!data.success) {
      Toast.show({
        text: data.message,
        type: 'danger',
      });
    }
    return data.success;
  } catch (e) {
    Toast.show({
      text: e.response.data.message,
      type: 'danger',
    });
    return false;
  }
}

export interface ResendCodeParams {
  iin: string;
}
export interface ResendCodeResponse {
  message: string;
  success: boolean;
}
async function resendCode(
  params: ResendCodeParams
): Promise<ResendCodeResponse> {
  try {
    const { data } = await axios.request<ResendCodeResponse>({
      url: 'refresh_code',
      params,
      method: 'post',
    });
    return data;
  } catch (e) {
    Toast.show({
      text: e.response.data.message,
      type: 'danger',
    });
    return { message: '', success: false };
  }
}

export interface AcceptCodeParams {
  iin: string;
  code: string;
}
async function acceptCode(params: AcceptCodeParams): Promise<boolean> {
  try {
    const { data } = await axios.request<BaseBackendDataInterface>({
      url: 'accept_code',
      params,
      method: 'post',
    });
    return data.success;
  } catch (e) {
    return false;
  }
}

export interface ResetPasswordParams {
  iin: string;
  code: string;
  password: string;
  confirm_password: string;
}

async function resetPassword(params: ResetPasswordParams): Promise<LoginData> {
  const { data } = await axios.request<LoginData>({
    url: 'reset_password',
    params,
    method: 'post',
  });

  return data;
}
