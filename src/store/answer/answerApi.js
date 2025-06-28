import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const answerApi = createApi({
    reducerPath: "answerApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Answer"],
    endpoints: (builder) => ({
        getAnswer: builder.query({
            query: () => ({
                url: "/answers/list",
                method: "GET",
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Answer"],
        }),
        saveAnswer: builder.mutation({
            query: ({ question_id, selected_option_id, answer_text }) =>({
                url: "/answers",
                method: "POST",
                body: { question_id, selected_option_id, answer_text },
            }),
            transformResponse(response) {
                return response;
            },
            invalidatesTags:["Answer"],
        }),
    }),
});

export const {
    useLazyGetAnswerQuery,
    useSaveAnswerMutation
} = answerApi;