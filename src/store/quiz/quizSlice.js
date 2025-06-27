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

      // Validasi index dan list
      if (!state.listQuestion || number < 0 || number >= state.listQuestion.length) return;

      state.numberQuestion = number;
      state.activeQuestion = state.listQuestion[number];

      // Jika mulai quiz
      if (!state.startQuiz) {
        state.startQuiz = true;
      }

      // ❌ Jangan set finishQuiz otomatis di sini
      // finishQuiz hanya dikontrol saat waktu habis atau user klik selesai
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
  setStartQuiz,
  setFinishQuiz,
  clearQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
