import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userSlice from "./user/userSlice";
import inetSlice from "./inet/inetSlice";
import quizSlice from "./quiz/quizSlice";
import examSlice from "./exam/examSlice";
import { userApi } from "./user/userApi";
import { examApi } from "./exam/examApi";
import { authApi } from "./auth/authApi";
import { questionApi } from "./question/questionApi";
import { answersApi } from "./answers/answersApi";
import { answerApi } from "./answer/answerApi";
import { batchApi } from "./exam/batchApi";
import { assesmentApi } from "./assesment/assesmentApi";

const reducer = combineReducers({
    user: userSlice,
    inet: inetSlice,
    quiz: quizSlice,
    exam: examSlice,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [examApi.reducerPath]: examApi.reducer,
    [questionApi.reducerPath]: questionApi.reducer,
    [answersApi.reducerPath]: answersApi.reducer,
    [answerApi.reducerPath]: answerApi.reducer,
    [batchApi.reducerPath]: batchApi.reducer,
    [assesmentApi.reducerPath]: assesmentApi.reducer,
});

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            userApi.middleware,
            examApi.middleware,
            questionApi.middleware,
            answersApi.middleware,
            answerApi.middleware,
            batchApi.middleware,
            assesmentApi.middleware,
        ),
});

export default store;