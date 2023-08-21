import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  isChange: false,
  currentQuiz: null,
  quizList: null,
  error: null,
  isExamStart: false,
  isFinished: false,
  totalScore: {
    correctCount: 0,
    wrongAttemps: [],
  },
};

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    getQuizStart: (state) => {
      state.isLoading = true;
    },
    getQuizSuccess: (state, action) => {
      state.isLoading = false;
      state.quizList = action.payload;
    },
    getOneQuizStart: (state) => {
      state.isLoading = true;
    },
    getOneQuizSuccess: (state, action) => {
      state.isLoading = false;
      state.currentQuiz = action.payload;
    },
    addQuizStart: (state) => {
      state.isLoading = true;
    },
    addQuizSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    addQuizFailure: (state) => {
      state.isLoading = false;
    },
    deleteQuizStart: (state) => {
      state.isLoading = true;
    },
    deleteQuizSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    quizExamStart: (state) => {
      state.isExamStart = true;
      state.isFinished = false;
    },
    quizFinishSuccess: (state, action) => {
      state.isExamStart = false;
      state.isFinished = true;
      state.totalScore = action.payload;
    },
  },
});
export const {
  getQuizStart,
  getQuizSuccess,
  getOneQuizStart,
  getOneQuizSuccess,
  addQuizStart,
  addQuizSuccess,
  deleteQuizStart,
  deleteQuizSuccess,
  addQuizFailure,
  quizExamStart,
  quizFinishSuccess,
} = quizSlice.actions;
export default quizSlice.reducer;
