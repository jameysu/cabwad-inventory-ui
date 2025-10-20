import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { jsonPlaceholderApi } from "./services/jsonPlaceholderApi";
import { authApi } from "./services/authApi";
import authReducer from "./slices/authSlice";
import { itemApi } from "./services/itemApi";

export const store = configureStore({
  reducer: {
    [jsonPlaceholderApi.reducerPath]: jsonPlaceholderApi.reducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(jsonPlaceholderApi.middleware)
      .concat(authApi.middleware)
      .concat(itemApi.middleware),
});

setupListeners(store.dispatch);
