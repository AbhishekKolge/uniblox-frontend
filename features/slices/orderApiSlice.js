import { apiSlice } from '../../app/api/apiSlice';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => ({
        url: '/order/cart',
      }),
      providesTags: ['Cart'],
    }),
    getCartPrice: builder.query({
      query: (queries) => ({
        url: '/order/cart/price',
        params: queries,
      }),
      providesTags: ['CartPrice'],
    }),
    createOrder: builder.mutation({
      query: (orderDetails) => ({
        url: '/order',
        method: 'POST',
        body: orderDetails,
      }),
    }),
    verifyOrder: builder.mutation({
      query: (verifyDetails) => ({
        url: '/order/verify',
        method: 'POST',
        body: verifyDetails,
      }),
      invalidatesTags: [
        'Cart',
        'CartPrice',
        'Coupon',
        'Products',
        'Product',
        'Order',
      ],
    }),
    getOrders: builder.query({
      query: (queries) => ({
        url: '/order',
        params: queries,
      }),
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetCartPriceQuery,
  useGetCartQuery,
  useCreateOrderMutation,
  useVerifyOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;
