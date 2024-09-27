import { apiSlice } from '../../app/api/apiSlice';

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: () => ({
        url: '/category',
      }),
      providesTags: ['Category'],
    }),
  }),
});

export const { useGetAllCategoriesQuery } = categoryApiSlice;
