import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseApi";

export const stockApi = createApi({
  reducerPath: "stocksApi",
  baseQuery,

  tagTypes: ["Stocks"],

  endpoints: (builder) => ({
    getStocks: builder.query({
      query: () => "stock/get-all",
      providesTags: ["Stocks"],
    }),

    getStocksSortedByControlNumber: builder.query({
      query: () => "stock/get-all-stock-by-cn",
      providesTags: ["Stocks"],
    }),

    getStockById: builder.mutation({
      query: (item_id) => ({
        url: "stock/get-by-item",
        method: "POST",
        body: { item_id },
      }),
      invalidatesTags: ["Stocks"],
    }),

    addStocks: builder.mutation({
      query: (stocks) => ({
        url: "stock/add-bulk-stock",
        method: "POST",
        body: stocks,
      }),
      invalidatesTags: ["Stocks"],
    }),

    updateStock: builder.mutation({
      query: (newStock) => ({
        url: "stock/update",
        method: "PUT",
        body: newStock,
      }),
      invalidatesTags: ["Stocks"],
    }),

    deleteStock: builder.mutation({
      query: (id) => ({
        url: "stock/remove",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Stocks"],
    }),

    returnStock: builder.mutation({
      query: (data) => ({
        url: "stock/return-stock-out",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Stocks"],
    }),
    updateAccuracy: builder.mutation({
      query: (data) => ({
        url: "stock/update-stock-accuracy",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Stocks"],
    }),
    getAccuracyCount: builder.query({
      query: () => "/stock/get-accuracy-count",
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockByIdMutation,
  useAddStocksMutation,
  useUpdateStockMutation,
  useDeleteStockMutation,
  useGetStocksSortedByControlNumberQuery,
  useReturnStockMutation,
  useUpdateAccuracyMutation,
  useGetAccuracyCountQuery,
} = stockApi;
