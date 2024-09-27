import { apiSlice } from '../../app/api/apiSlice';

export const sizeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSizes: builder.query({
      query: () => ({
        url: '/size',
      }),
      providesTags: ['Size'],
    }),
  }),
});

export const { useGetAllSizesQuery } = sizeApiSlice;
