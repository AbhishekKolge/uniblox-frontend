import { apiSlice } from '../../app/api/apiSlice';

export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: ({ queries, productId }) => ({
        url: `/review/${productId}`,
        params: queries,
      }),
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation({
      query: ({ reviewData, productId }) => ({
        url: `/review/${productId}`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Reviews', 'Products', 'Product'],
    }),
    updateReview: builder.mutation({
      query: ({ reviewData, reviewId }) => ({
        url: `/review/${reviewId}`,
        method: 'PATCH',
        body: reviewData,
      }),
      invalidatesTags: ['Reviews', 'Products', 'Product'],
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/review/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews', 'Products', 'Product'],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = addressApiSlice;
