import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../baseApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUsers: builder.query({
      query: () => "auth/users",
      providesTags: ["Users"],
    }),
    addUser: builder.mutation({
      query: (body) => ({
        url: "auth/add-user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: "auth/update-user",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    lockUnlockAllUsers: builder.mutation({
      query: (body) => ({
        url: "auth/users/lock-unlock-all",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useLockUnlockAllUsersMutation,
} = authApi;
