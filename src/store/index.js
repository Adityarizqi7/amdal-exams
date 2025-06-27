import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userSlice from "./user/userSlice";
import inetSlice from "./inet/inetSlice";
import quizSlice from "./quiz/quizSlice";
import examSlice from "./exam/examSlice";
import { userApi } from "./user/userApi";
import { authApi } from "./auth/authApi";
import { examApi } from "./exam/examApi";

const reducer = combineReducers({
    user: userSlice,
    inet: inetSlice,
    quiz: quizSlice,
    exam: examSlice,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [examApi.reducerPath]: examApi.reducer,
});

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware,
            examApi.middleware,
        ),
});

export default store;