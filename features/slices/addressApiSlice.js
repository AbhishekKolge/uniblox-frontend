import { apiSlice } from '../../app/api/apiSlice';

export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAddresses: builder.query({
      query: () => ({
        url: '/address',
      }),
      providesTags: ['Address'],
    }),
    createAddress: builder.mutation({
      query: (addressData) => ({
        url: '/address',
        method: 'POST',
        body: addressData,
      }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/address/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation({
      query: ({ addressData, addressId }) => ({
        url: `/address/${addressId}`,
        method: 'PATCH',
        body: addressData,
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetAllAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} = addressApiSlice;
