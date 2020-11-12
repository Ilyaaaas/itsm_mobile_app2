import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { HealthyLifestyleInterface } from '../types/healthy-lifestyle.interface';
import { getHealthyLifestyleListAction } from './healthy-lifestyle.actions';

export const healthyLifestyleAdapter = createEntityAdapter<
  HealthyLifestyleInterface
>({
  selectId: (model) => model.title,
});

export const healthyLifestyleSlice = createSlice({
  name: 'healthy-lifestyle',
  initialState: healthyLifestyleAdapter.getInitialState({
    isLoading: false,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getHealthyLifestyleListAction.pending, (state) => ({
      ...state,
      isLoading: true,
    }));
    builder.addCase(
      getHealthyLifestyleListAction.fulfilled,
      (state, action) => {
        healthyLifestyleAdapter.setAll(state, action.payload.result);
        state.isLoading = false;
      }
    );
    builder.addCase(getHealthyLifestyleListAction.rejected, (state) => ({
      ...state,
      isLoading: false,
    }));
  },
});
