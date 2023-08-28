import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  studentList: null,
  isChange: false,
  teacherList: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // GET ALL USERS
    changeUserStart: (state) => {
      state.isLoading = true;
    },
    changeUserSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    changeUserFailure: (state) => {
      state.isLoading = false;
    },
    getAllUsersSuccess: (state, action) => {
      state.isLoading = false;
      state.studentList = action.payload
        .filter((user) => user.role === "student")
        .map((item, index) => ({ ...item, key: index + 1 }));
      state.teacherList = action.payload
        .filter((user) => user.role === "teacher")
        .map((item, index) => ({ ...item, key: index + 1 }));
    },
  },
});
export const {
  changeUserStart,
  changeUserSuccess,
  changeUserFailure,
  getAllUsersSuccess,
} = userSlice.actions;
export default userSlice.reducer;
