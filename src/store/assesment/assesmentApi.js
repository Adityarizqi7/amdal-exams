import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "../../utils/customFetch";

export const assesmentApi = createApi({
    reducerPath: "assesmentApi",
    baseQuery: customBaseQuery,
    tagTypes: ["Assesment"],
    endpoints: (builder) => ({
        getResult: builder.query({
            query: () => ({
                url: "my-submissions",
                method: "GET",
            }),
            transformResponse: (response) => response,
            providesTags: ["Assesment"],
            refetchOnMountOrArgChange: true,
        }),
    }),
});
export const {
    useLazyGetResultQuery
} = assesmentApi;