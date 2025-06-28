import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  listQuestion: null,
  numberQuestion: 0,
  activeQuestion: null,
  infoQuiz: null,
  answerQuestion: [],
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
    },
    setAnswerQuestion: (state, action) => {
      state.answerQuestion = action.payload
    },
    changeAnswerQuestion: (state, action) => {
      const { question_id, selected_option_id, answer_text } = action.payload;
      const index = state.answerQuestion.findIndex(
        (el) => el.question_id === question_id
      );

      if (index !== -1) {
        state.answerQuestion[index] = { ...state.answerQuestion[index], selected_option_id: selected_option_id, answer_text };
      } else {
        state.answerQuestion.push({ question:{ id:question_id }, question_id, selected_option_id: selected_option_id, answer_text });
      }
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
  changeAnswerQuestion,
  setInfoQuestion,
  setStartQuiz,
  setFinishQuiz,
  clearQuiz,
} = quizSlice.actions;

export default quizSlice.reducer;
