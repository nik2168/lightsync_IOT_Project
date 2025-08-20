import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const server = Constants.expoConfig?.extra?.server ?? "";

const api = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const token = await SecureStore.getItemAsync("press-token");
    const rawBaseQuery = fetchBaseQuery({
      baseUrl: server,
      prepareHeaders: (headers) => {
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });
    return rawBaseQuery(args, api, extraOptions);
  },
  tagTypes: ["Posts", "User"],
  endpoints: (builder) => ({
    getPostNews: builder.query({
      query: () => `/api/news`,
      providesTags: ["Posts"],
    }),

    getProfile: builder.query({
      query: (user_id) => `/api/users/${user_id}`,
      providesTags: ["User"],
    }),

    updateProfileImage: builder.mutation({
      query: ({ user_id, formdata }) => ({
        url: `/api/change-profile-image/${user_id}`,
        method: "POST",
        body: formdata,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (formData) => ({
        url: `/api/change-password`,
        method: "POST",
        body: formData,
      }),
    }),

    updateProfile: builder.mutation({
      query: ({ formData, user_id }) => ({
        url: `/api/users/${user_id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export default api;

export const {
  useGetPostNewsQuery,
  useGetProfileQuery,
  useUpdateProfileImageMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = api;
