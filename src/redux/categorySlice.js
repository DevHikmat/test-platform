import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  category: null,
  error: null,
  isChange: false,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    getAllCategoryStart: (state) => {
      state.isLoading = true;
    },
    getAllCategorySuccess: (state, action) => {
      state.isLoading = false;
      state.category = action.payload;
    },
    changeCategoryStart: (state) => {
      state.isLoading = true;
    },
    changeCategorySuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    changeCategoryFailure: (state) => {
      state.isLoading = false;
    },

    deleteCategoryStart: (state) => {
      state.isLoading = true;
    },
    deleteCategorySuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
  },
});
export const {
  getAllCategoryStart,
  getAllCategorySuccess,
  changeCategoryStart,
  changeCategorySuccess,
  deleteCategoryStart,
  deleteCategorySuccess,
  changeCategoryFailure,
} = categorySlice.actions;
export default categorySlice.reducer;
