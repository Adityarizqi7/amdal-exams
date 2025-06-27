import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Auth"],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ username, password }) =>({
                url: "auth/login",
                method: "POST",
                body: { username, password },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Auth"],
        }),
        whoami: builder.query({
            query: () => ({
                url: "auth/whoami",
                method: "GET",
            }),
            transformResponse: (response) => response,
            providesTags: ["Auth"],
        })
    }),
});

export const {
    useLoginMutation,
    useWhoamiQuery
} = authApi;