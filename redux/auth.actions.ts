import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  AcceptCodeParams,
  authService,
  RegisterParams,
  ResendCodeParams,
  ResendCodeResponse,
} from '../services/auth.service';

export const registrationAction = createAsyncThunk<boolean, RegisterParams>(
  'registration',
  (arg) => authService.register(arg)
);
export const acceptRegistrationCodeAction = createAsyncThunk<
  boolean,
  AcceptCodeParams
>('accept-code', (arg) => authService.acceptCode(arg));

export const refreshCodeAction = createAsyncThunk<
  ResendCodeResponse,
  ResendCodeParams
>('refresh-code', (arg) => authService.resendCode(arg));
