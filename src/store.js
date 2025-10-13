import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { jsonPlaceholderApi } from "./services/jsonPlaceholderApi";
import { authApi } from "./services/authApi";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    [jsonPlaceholderApi.reducerPath]: jsonPlaceholderApi.reducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(jsonPlaceholderApi.middleware)
      .concat(authApi.middleware),
});

setupListeners(store.dispatch);
