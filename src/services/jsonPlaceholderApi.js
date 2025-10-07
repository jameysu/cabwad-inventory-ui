import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jsonPlaceholderApi = createApi({
  reducerPath: "jsonPlaceholderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  endpoints: (builder) => ({
    getPosts: builder.mutation({
      query: () => "posts",
    }),
    getPostsById: builder.query({
      query: (id) => `posts/${id}`,
    }),
    createPosts: builder.mutation({
      query: (newPost) => ({
        url: "posts",
        method: "POST",
        body: newPost,
      }),
    }),
  }),
});

export const {
  useGetPostsMutation,
  useGetPostsByIdQuery,
  useCreatePostsMutation,
} = jsonPlaceholderApi;
