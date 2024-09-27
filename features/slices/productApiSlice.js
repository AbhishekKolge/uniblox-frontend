import { apiSlice } from '../../app/api/apiSlice';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (queries) => {
        return {
          url: '/product',
          params: queries,
        };
      },
      providesTags: ['Products'],
    }),
    getSingleProduct: builder.query({
      query: (productId) => {
        return {
          url: `/product/${productId}`,
        };
      },
      providesTags: ['Product'],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `/product/wishlist/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Products', 'Product'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/product/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products', 'Product'],
    }),
    addToCart: builder.mutation({
      query: (productId) => ({
        url: `/product/cart/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Products', 'Product', 'Cart', 'CartPrice'],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/product/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products', 'Product', 'Cart', 'CartPrice'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} = productApiSlice;
