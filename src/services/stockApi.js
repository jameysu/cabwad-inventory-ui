import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseApi";

export const stockApi = createApi({
  reducerPath: "stocksApi",
  baseQuery,

  // 🔥 DEFINE TAG TYPES
  tagTypes: ["Stocks"],

  endpoints: (builder) => ({
    // =======================
    // QUERIES
    // =======================
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

    // =======================
    // MUTATIONS
    // =======================
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
      invalidatesTags: ["Stocks"], // 🔥 AUTO REFRESH EVERYTHING
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
} = stockApi;
