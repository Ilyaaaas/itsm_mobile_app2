import { configureStore } from '@reduxjs/toolkit';

import { formReducer } from '../reducers/form-reducer';
import { authSlice } from './auth.slice';
import { healthyLifestyleSlice } from './healthy-lifestyle.slice';

export const store = configureStore({
  reducer: {
    form: formReducer,
    auth: authSlice.reducer,
    healthyLifestyle: healthyLifestyleSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
