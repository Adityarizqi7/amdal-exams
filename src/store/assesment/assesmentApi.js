import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const assesmentApi = createApi({
    reducerPath: "assesmentApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Assesment"],
    endpoints: (builder) => ({
        getResult: builder.query({
            query: (search) => ({
                url: "result-qualified",
                method: "GET",
                params: { ...search }
            }),
            transformResponse: (response) => response,
            providesTags: ["Assesment"],
            refetchOnMountOrArgChange: true,
        }),
        getResultExport: builder.query({
            query: (search) => ({
                url: "export-result-qualified",
                method: "GET",
                params: { ...search }
            }),
            transformResponse: (response) => response,
            providesTags: ["Assesment"],
            refetchOnMountOrArgChange: true,
        }),
    }),
});
export const {
    useLazyGetResultQuery,
    useLazyGetResultExportQuery
} = assesmentApi;