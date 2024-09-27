import { apiSlice } from '../../app/api/apiSlice';

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: (queries) => {
        return {
          url: '/coupon',
          params: queries,
        };
      },
      providesTags: ['Coupon'],
    }),
  }),
});

export const { useGetAllCouponsQuery } = couponApiSlice;
