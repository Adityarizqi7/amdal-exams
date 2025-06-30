import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const answersApi = createApi({
    reducerPath: "answersApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Answers"],
    endpoints: (builder) => ({
        getAnswers: builder.query({
            query: (search) => ({
                url: "options",
                method: "GET",
                params: { ...search },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Answers"],
        }),
        getDetail: builder.query({
            query: (id) => ({
                url: `/options/${id}`,
                method: "GET",
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Answers"],
        }),
        create: builder.mutation({
            query: ({ question_id, option_text, is_correct }) =>({
                url: "options",
                method: "POST",
                body: { question_id, option_text, is_correct },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Answers"],
        })
    }),
});

export const {
    useLazyGetDetailQuery,
    useLazyGetAnswersQuery,
    useCreateMutation
} = answersApi;