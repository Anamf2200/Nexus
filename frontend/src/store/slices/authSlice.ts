import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api';

interface AuthState {
  token: string | null;
  user: any | null;
}

// Safer parse: handles null or "undefined" strings
const safeParse = (item: string | null) => {
  if (!item || item === 'undefined') return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  token: localStorage.getItem('token') || null,
  user: safeParse(localStorage.getItem('user')),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: any }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
        api.util.resetApiState();

    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
