import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  error: null,
  isChange: true,
};

export const questionSlice = createSlice({
  name: "questionList",
  initialState,
  reducers: {
    getAllQuestionStart: (state) => {
      state.isLoading = true;
    },
    getAllQuestionSuccess: (state) => {
      state.isLoading = false;
    },
    addQuestionStart: (state) => {
      state.isLoading = true;
    },
    addQuestionSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    deleteQuestionStart: (state) => {
      state.isLoading = true;
    },
    deleteQuestionSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
  },
});
export const {
  getAllQuestionStart,
  getAllQuestionSuccess,
  addQuestionStart,
  addQuestionSuccess,
  deleteQuestionStart,
  deleteQuestionSuccess,
} = questionSlice.actions;
export default questionSlice.reducer;
