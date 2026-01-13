import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseApi";

export const genApi = createApi({
  reducerPath: "genApi",
  baseQuery,
  endpoints: (builder) => ({
    getUserTypes: builder.query({
      query: () => ({
        url: "gentables",
        params: { description: "USERTYPES" },
      }),
    }),
  }),
});

export const { useGetUserTypesQuery } = genApi;
