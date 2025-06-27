import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const examApi = createApi({
    reducerPath: "examApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Exam"],
    endpoints: (builder) => ({
        getExam: builder.query({
            query: () => ({
                url: "exams/all",
                method: "GET",
            }),
            transformResponse: (response) => response,
            providesTags: ["Exam"],
        }),
        create: builder.mutation({
            query: ({ title, description, image, duration }) =>({
                url: "exams",
                method: "POST",
                body: { title, description, image, duration },
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Auth"],
        }),
    }),
});
export const {
    useCreateMutation,
    useLazyGetExamQuery
} = examApi;