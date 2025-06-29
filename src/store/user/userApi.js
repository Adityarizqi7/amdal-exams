import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: customBaseQuery,
    tagTypes: ["User"],
    endpoints: (builder) => ({
        getExam: builder.query({
            query: () => ({
                url: "exam",
                method: "GET",
            }),
            transformResponse: (response) => response,
            providesTags: ["User"],
            refetchOnMountOrArgChange: true,
        }),
        getUser: builder.query({
            query: (search) => ({
                url: "users",
                method: "GET",
                params: { search }
            }),
            transformResponse: (response) => response,
            providesTags: ["User"],
            refetchOnMountOrArgChange: true,
        })
    }),
});
export const {
    useLazyGetUserQuery,
    useLazyGetExamQuery
} = userApi;