import { User } from "../../types";
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
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;
