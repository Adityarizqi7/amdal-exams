import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    listExams: null,
    activeExam: null
};

const examSlice = createSlice({
    name: "exam",
    initialState: initialValue,
    reducers: {
        setListExam: (state, action) => {
            state.listExams = action.payload;
        },
        setActiveExam:(state, action) => {
            state.activeExam = state.listExams?.find((el) => el.id === action.payload);
        },
        clear: () => initialValue,
    },
});

export const { setListExam, setActiveExam, clear } = examSlice.actions;

export default examSlice.reducer;
