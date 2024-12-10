import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api/' }), 
  endpoints: (builder) => ({
    fetchCustomerData: builder.mutation({
      query: ({ Limit, Offset,Search }) => ({
        url: 'customers',
        method: 'POST',
        body: {
          Limit, 
          Offset,
          Search
        },
      }),
      transformResponse: (response: any) => {
        const elem = response[0][0].result;
        return  elem.length ? JSON.parse(elem) : undefined;
      },
    }),
  }),
});

export const { useFetchCustomerDataMutation } = apiSlice;
