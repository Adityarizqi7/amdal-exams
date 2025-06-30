import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const batchApi = createApi({
    reducerPath: "batchApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Batch"],
    endpoints: (builder) => ({
        getBatch: builder.query({
            query: (search) => ({
                url: "exam-batches",
                method: "GET",
                params: { ...search },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Batch"],
        }),
        getAll: builder.query({
            query: () => ({
                url: "exam-batches/all",
                method: "GET",
                // params: { search },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Batch"],
        }),
        getDetail: builder.query({
            query: (id) => ({
                url: `/exam-batches/${id}`,
                method: "GET",
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Batch"],
        }),
        create: builder.mutation({
            query: ({ exam_id, name, start_time, end_time, max_participants }) =>({
                url: "exam-batches",
                method: "POST",
                body: { exam_id, name, start_time, end_time, max_participants },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Batch"],
        })
    }),
});

export const {
    useLazyGetAllQuery,
    useLazyGetDetailQuery,
    useLazyGetBatchQuery,
    useCreateMutation
} = batchApi;