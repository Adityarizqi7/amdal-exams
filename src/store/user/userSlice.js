import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    id: "",
    username: "",
    exam: "",
};

const userSlice = createSlice({
    name: "user",
    initialState: initialValue,
    reducers: {
        setUserDetails: (state, action) => {
          console.log(action.payload)
          return { ...state, ...action.payload };
        },
        logout: () => initialValue,
    },
});

export const { setUserDetails, logout } = userSlice.actions;

export default userSlice.reducer;
