import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { logoutHandler } from '../../features/actions/authActions';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    api.dispatch(logoutHandler({ isSession: true }));
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
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
  endpoints: (builder) => ({}),
});
