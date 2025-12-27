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


     updateProfileImage: builder.mutation<User, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return {
          url: '/user/me/avatar',
          method: 'PUT',
          body: formData,
        };
      },
    }),

    changePassword: builder.mutation<
  { message: string },
  { currentPassword: string; newPassword: string }>({
  query: body => ({
    url: '/user/change-password',
    method: 'PATCH',
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
  useGetAllUsersQuery,
  useUpdateProfileImageMutation,
  useChangePasswordMutation
} = userApi;
