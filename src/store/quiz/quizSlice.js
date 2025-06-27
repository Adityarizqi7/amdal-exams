import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  listQuestion: null,
  numberQuestion: 0,
  activeQuestion: null,
  infoQuiz: null,
  answerQuestion: null,
  startQuiz: false,
  finishQuiz: false,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState: initialValue,
  reducers: {
    setListQuestion: (state, action) => {
      state.listQuestion = action.payload;
    },
    setNumberQuestion: (state, action) => {
      const number = action.payload;

      // Pastikan listQuestion sudah ada
      if (!state.listQuestion || number < 0 || number >= state.listQuestion.length || state.finishQuiz) return;

      state.numberQuestion = number;
      state.activeQuestion = state.listQuestion[number];

      // Jika mulai quiz
      if (number >= 0 && !state.startQuiz) {
        state.startQuiz = true;
      }

      // Jika soal terakhir
      if (number === state.listQuestion.length - 1) {
        state.finishQuiz = true;
      } else {
        state.finishQuiz = false;
      }
    },
    setAnswerQuestion: (state, action) => {
      state.answerQuestion = {
        ...state.answerQuestion,
        ...action.payload,
      };
    },
    setInfoQuestion: (state, action) => {
      state.infoQuiz = action.payload;
    },
    setStartQuiz: (state) => {
      state.startQuiz = true;
    },
    setFinishQuiz: (state) => {
      state.finishQuiz = true;
    },
    clearQuiz: () => initialValue, 
  },
});

export const {
  setListQuestion,
  setNumberQuestion,
  setAnswerQuestion,
  setInfoQuestion,
  setFinishQuiz,
  clearQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
