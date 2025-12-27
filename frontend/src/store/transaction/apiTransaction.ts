import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Transaction, CreateTransactionDto } from '../../types/type';

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token; // your JWT from redux state
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Transaction'],
  endpoints: (builder) => ({
    deposit: builder.mutation<Transaction, CreateTransactionDto>({
      query: (body) => ({
        url: '/transaction/deposit',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transaction'],
    }),
    withdraw: builder.mutation<Transaction, CreateTransactionDto>({
      query: (body) => ({
        url: '/transaction/withdraw',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transaction'],
    }),
    transfer: builder.mutation<Transaction, CreateTransactionDto>({
      query: (body) => ({
        url: '/transaction/transfer',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transaction'],
    }),
    getTransactions: builder.query<Transaction[], void>({
      query: () => '/transaction/my',
      providesTags: ['Transaction'],
    }),
  }),
});

export const {
  useDepositMutation,
  useWithdrawMutation,
  useTransferMutation,
  useGetTransactionsQuery,
} = transactionApi;
