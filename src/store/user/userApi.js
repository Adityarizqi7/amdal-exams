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
                params: { ...search }
            }),
            transformResponse: (response) => response,
            providesTags: ["User"],
            refetchOnMountOrArgChange: true,
        }),
        create: builder.mutation({
            query: ({ name, email, role, is_active, password }) =>({
                url: "users",
                method: "POST",
                body: { name, email, role, is_active, password },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["User"],
        }),
        getDetail: builder.query({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET",
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["User"],
        }),
    }),
});
export const {
    useGetDetailQuery,
    useLazyGetUserQuery,
    useLazyGetExamQuery,
    useCreateMutation
} = userApi;