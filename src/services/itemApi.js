import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseApi";

export const itemApi = createApi({
  reducerPath: "itemsApi",
  baseQuery,
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => "item/get-all",
    }),
    createItem: builder.mutation({
      query: (item) => ({
        url: "item/create",
        method: "POST",
        body: item,
      }),
    }),
    updateItem: builder.mutation({
      query: (newItem) => ({
        url: "item/update",
        method: "PUT",
        body: newItem,
      }),
    }),
  }),
});

export const {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
} = itemApi;
