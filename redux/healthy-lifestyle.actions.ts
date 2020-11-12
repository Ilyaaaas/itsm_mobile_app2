import { createAsyncThunk } from '@reduxjs/toolkit';

import { zozhService } from '../services/zozh.service';

export const getHealthyLifestyleListAction = createAsyncThunk(
  'get-healthy-lifestyle-list',
  () => zozhService.get()
);
