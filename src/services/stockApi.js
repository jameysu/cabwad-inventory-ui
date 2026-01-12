import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseApi";

export const stockApi = createApi({
  reducerPath: "stocksApi",
  baseQuery,
  endpoints: (builder) => ({
    getStocks: builder.query({
      query: () => "stock/get-all",
    }),
    getStockById: builder.mutation({
      query: (item_id) => ({
        url: "stock/get-by-item",
        method: "POST",
        body: { item_id },
      }),
    }),
    addStocks: builder.mutation({
      query: (stocks) => ({
        url: "stock/add-bulk-stock",
        method: "POST",
        body: stocks,
      }),
    }),
    updateStock: builder.mutation({
      query: (newStock) => ({
        url: "stock/update",
        method: "PUT",
        body: newStock,
      }),
    }),
    deleteStock: builder.mutation({
      query: (id) => ({
        url: "stock/remove",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Items"],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockByIdMutation,
  useAddStocksMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
} = stockApi;
