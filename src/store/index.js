import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userSlice from "./user/userSlice";
import inetSlice from "./inet/inetSlice";
import quizSlice from "./quiz/quizSlice";
import { userApi } from "./user/userApi";
import { examApi } from "./exam/examApi";
import { authApi } from "./auth/authApi";

const reducer = combineReducers({
    user: userSlice,
    inet: inetSlice,
    quiz: quizSlice,
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