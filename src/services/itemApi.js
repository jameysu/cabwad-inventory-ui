import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseApi";

export const itemApi = createApi({
  reducerPath: "itemsApi",
  baseQuery,
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => "item/get-all",
    }),
  }),
});

export const { useGetItemsQuery } = itemApi;
