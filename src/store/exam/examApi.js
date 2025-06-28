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
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Exam"],
        }),
        getListQuestion: builder.query({
            query: (exam_id) => ({
                url: `/questions/list/${exam_id}`,
                method: "GET",
            }),
            transformResponse(response) {
                return response;

            },
            invalidatesTags:["Exam"],
        }),
        startExamBe: builder.mutation({
            query: ({ exam_id }) =>({
                url: "/exam-submissions/start",
                method: "POST",
                body: { exam_id },
            }),
            transformResponse(response) {
                return response;
            },
            invalidatesTags:["Exam"],
        }),
        endExamBe: builder.mutation({
            query: () =>({
                url: "/exam-submissions/submit",
                method: "POST",
            }),
            transformResponse(response) {
                return response;
            },
            invalidatesTags:["Exam"],
        }),
        myExam: builder.query({
            query: () =>({
                url: "/my-submissions",
                method: "GET",
            }),
            transformResponse(response) {
                return response;
            },
            invalidatesTags:["Exam"],
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
            invalidatesTags:["Exam"],
        })
    }),
});

export const {
    useLazyGetExamQuery,
    useLazyGetListQuestionQuery,
    useStartExamBeMutation,
    useEndExamBeMutation,
    useLazyMyExamQuery,
    useCreateMutation
} = examApi;