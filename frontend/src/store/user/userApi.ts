import { User } from "../..";
import { api } from "../api";




export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<User,void>({
      query: () => '/user/me',

    }),

    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/user/me',
        method: 'PUT',
        body,
      }),

    }),

     getAllUsers: builder.query<User[], void>({
      query: () => '/user', // fetch all users
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery
} = userApi;
