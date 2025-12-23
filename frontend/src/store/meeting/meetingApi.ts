import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const meetingApi = createApi({
  reducerPath: 'meetingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Meeting'],
  endpoints: (builder) => ({
    createMeeting: builder.mutation({
      query: (body) => ({
        url: '/meeting',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Meeting'],
    }),

getMeetings: builder.query<any[], void>({
      query: () => '/meeting',
      providesTags: ['Meeting'],
    }),

updateMeetingStatus: builder.mutation<
  any,
  { id: string; status: 'pending' | 'accepted' | 'rejected' }>
  ({
  query: ({ id, status }) => ({
    url: `/meeting/${id}/status`,
    method: 'PUT',
    body: { status }, // ✅ lowercase only
  }),
  invalidatesTags: ['Meeting'],
}),


  }),
});

export const {
  useCreateMeetingMutation,
  useGetMeetingsQuery,
  useUpdateMeetingStatusMutation,
} = meetingApi;
