import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    id: null,
    name: null,
    email: null,
    email_verified_at: null,
    role: null,
    is_active: false,
    batch: null,
    start_time: null,
    end_time: null,
    exam_id: null,
    start_exam: null,
    submited_at: null
};

const userSlice = createSlice({
    name: "user",
    initialState: initialValue,
    reducers: {
        setUserDetails: (state, action) => {
            return { ...state, ...action.payload };
        },
        setStartTime: (state, action) => {
            state.start_time = action.payload;
        },
        logout: () => initialValue,
    },
});

export const { setUserDetails, setStartTime, logout } = userSlice.actions;

export default userSlice.reducer;
