import { api } from "../api";

interface LoginRequest {
  email: string;
  password: string;
  role: 'entrepreneur' | 'investor';
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'entrepreneur' | 'investor';
  };
}

export type LoginResult = LoginResponse | { otpRequired: true; userId: string };



interface VerifyOtpRequest {
  userId: string;
  otp: string;
}

interface VerifyOtpResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'entrepreneur' | 'investor';
  };
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResult, LoginRequest>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),

    register: builder.mutation<LoginResponse, { name: string; email: string; password: string; role: 'entrepreneur' | 'investor' }>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
  }),


  
});

export const { useLoginMutation, useRegisterMutation, useVerifyOtpMutation } = authApi;
