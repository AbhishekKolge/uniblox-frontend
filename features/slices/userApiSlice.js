import { apiSlice } from '../../app/api/apiSlice';

export const useApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    showMe: builder.query({
      query: () => ({
        url: '/users/show-me',
      }),
      providesTags: ['User'],
    }),
    uploadProfileImage: builder.mutation({
      query: (fileData) => ({
        url: '/users/profile-image',
        method: 'POST',
        body: fileData,
      }),
      invalidatesTags: ['User'],
    }),
    removeProfileImage: builder.mutation({
      query: (profileImageId) => ({
        url: `/users/profile-image?profileImageId=${profileImageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (userDetails) => ({
        url: '/users',
        method: 'PATCH',
        body: userDetails,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useShowMeQuery,
  useUploadProfileImageMutation,
  useRemoveProfileImageMutation,
  useUpdateProfileMutation,
} = useApiSlice;
