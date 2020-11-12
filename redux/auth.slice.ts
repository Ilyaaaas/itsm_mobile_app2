import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  acceptRegistrationCodeAction,
  refreshCodeAction,
  registrationAction,
} from './auth.actions';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    registration: {
      phone: '',
      iin: '',
    },
    confirmCode: '',
    isFailedAcceptingCode: false,
    restorePassword: {
      iin: '',
      message: '',
    },
    sessionId: '',
  },
  reducers: {
    setSessionId: (state, action: PayloadAction<string>) => ({
      ...state,
      sessionId: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(registrationAction.fulfilled, (state, action) => {
      if (action.payload) {
        state.registration = action.meta.arg;
      }
    });

    builder.addCase(acceptRegistrationCodeAction.pending, (state) => {
      state.isFailedAcceptingCode = false;
    });
    builder.addCase(acceptRegistrationCodeAction.fulfilled, (state, action) => {
      if (action.payload) {
        state.confirmCode = action.meta.arg.code;
      } else {
        state.isFailedAcceptingCode = true;
      }
    });

    builder.addCase(refreshCodeAction.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.restorePassword = {
          iin: action.meta.arg.iin,
          message: action.payload.message,
        };
      }
    });
  },
});
