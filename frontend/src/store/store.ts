import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import authReducer from './slices/authSlice';
import { meetingApi } from './meeting/meetingApi';
import callreducer from './call/callSlice'
import { documentApi } from './document/documentApi';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [meetingApi.reducerPath]: meetingApi.reducer,  
   [documentApi.reducerPath]: documentApi.reducer, 
    auth: authReducer,
    call:callreducer
  },
 middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      meetingApi.middleware,
      documentApi.middleware // ✅ ADD THIS
    ),
  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
