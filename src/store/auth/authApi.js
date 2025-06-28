import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Auth"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }) =>({
                url: "login",
                method: "POST",
                body: { email, password },
            }),
            transformResponse(response) {
                return response;
            },
            invalidatesTags:["Auth"],
        }),
        logout: builder.query({
            query: () =>({
                url: "logout",
                method: "GET",
            }),
            transformResponse: (response) => response
        }),
        me: builder.query({
            query: () => ({
                url: "me",
                method: "GET",
            }),
            transformResponse: (response) => response,
            providesTags: ["Auth"],
        })
    }),
});

export const {
    useLoginMutation,
    useLazyLogoutQuery,
    useMeQuery
} = authApi;