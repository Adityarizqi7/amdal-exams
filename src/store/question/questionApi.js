import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const questionApi = createApi({
    reducerPath: "questionApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Question"],
    endpoints: (builder) => ({
        getQuestion: builder.query({
            query: (search) => ({
                url: "questions",
                method: "GET",
                params: { search },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Question"],
        }),
        getDetail: builder.query({
            query: (id) => ({
                url: `/questions/${id}`,
                method: "GET",
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Question"],
        }),
        create: builder.mutation({
            query: ({ exam_id, question_text, image, order, question_type, weight }) =>({
                url: "questions",
                method: "POST",
                body: { exam_id, question_text, image, order, question_type, weight },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Question"],
        })
    }),
});

export const {
    useLazyGetDetailQuery,
    useLazyGetQuestionQuery,
    useCreateMutation
} = questionApi;