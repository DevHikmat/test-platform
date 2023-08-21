import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  isLoading: false,
  isLogin: false,
  currentUser: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authUserStart: (state) => {
      state.isLoading = true;
    },
    authUserSuccess: (state, action) => {
      state.isLoading = false;
      state.isLogin = true;
      state.currentUser = action.payload;
    },
    authUserFailure: (state) => {
      state.isLoading = false;
    },
    authUpdateStart: (state) => {
      state.isLoading = true;
    },
    authUpdateSuccess: (state, action) => {
      state.isLoading = false;
      state.currentUser = action.payload;
    },
    authUpdateFailure: (state) => {
      state.isLoading = false;
    },
    authLogout: (state) => {
      state.currentUser = null;
      state.isLogin = false;
    },
  },
});
export const {
  authUserStart,
  authUserSuccess,
  authUserFailure,
  authLogout,
  authUpdateStart,
  authUpdateSuccess,
  authUpdateFailure,
} = userSlice.actions;
export default userSlice.reducer;
