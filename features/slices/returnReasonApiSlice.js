import { apiSlice } from '../../app/api/apiSlice';

export const returnReasonApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReturnReasons: builder.query({
      query: () => ({
        url: '/return-reason',
      }),
      providesTags: ['ReturnReason'],
    }),
  }),
});

export const { useGetAllReturnReasonsQuery } = returnReasonApiSlice;
