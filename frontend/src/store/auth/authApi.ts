import { api } from "../api";

interface LoginRequest {
  email: string;
  password: string;
  role: 'entrepreneur' | 'investor';
}

interface LoginResponse {
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
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: '/auth/login',
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

export const { useLoginMutation, useRegisterMutation } = authApi;
