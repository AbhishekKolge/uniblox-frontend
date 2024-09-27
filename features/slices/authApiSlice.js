import { apiSlice } from '../../app/api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userDetails) => ({
        url: '/auth/register',
        method: 'POST',
        body: userDetails,
      }),
    }),
    verify: builder.mutation({
      query: (verificationDetails) => ({
        url: '/auth/verify',
        method: 'POST',
        body: verificationDetails,
      }),
    }),
    login: builder.mutation({
      query: (userDetails) => ({
        url: '/auth/login',
        method: 'POST',
        body: userDetails,
      }),
      invalidatesTags: [
        'Address',
        'Category',
        'Coupon',
        'Products',
        'Product',
        'ReturnReason',
        'Size',
        'User',
        'Reviews',
        'Cart',
        'CartPrice',
        'Order',
      ],
    }),
    forgotPassword: builder.mutation({
      query: (userDetails) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: userDetails,
      }),
    }),
    resetPassword: builder.mutation({
      query: (passwordDetails) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: passwordDetails,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'DELETE',
      }),
      invalidatesTags: [
        'Address',
        'Category',
        'Coupon',
        'Products',
        'Product',
        'ReturnReason',
        'Size',
        'User',
        'Reviews',
        'Cart',
        'CartPrice',
        'Order',
      ],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authApiSlice;
