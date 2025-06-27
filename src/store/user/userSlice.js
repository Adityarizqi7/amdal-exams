import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    id: null,
    name: null,
    email: null,
    email_verified_at: null,
    role: null,
    is_active: false,
};

const userSlice = createSlice({
    name: "user",
    initialState: initialValue,
    reducers: {
        setUserDetails: (state, action) => {
            console.log(action.payload);
            return { ...state, ...action.payload };
        },
        logout: () => initialValue,
    },
});

export const { setUserDetails, logout } = userSlice.actions;

export default userSlice.reducer;
