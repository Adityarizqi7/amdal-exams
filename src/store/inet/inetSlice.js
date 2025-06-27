import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    online: false
};

const inetSlice = createSlice({
    name: "inet",
    initialState: initialValue,
    reducers: {
        setOnline: (state, action) => {
            state.online = action.payload;
        },
        clear: () => initialValue,
    },
});

export const { setOnline, clear } = inetSlice.actions;

export default inetSlice.reducer;
