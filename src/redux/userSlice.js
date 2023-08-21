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
    getAllUsersStart: (state) => {
      state.isLoading = true;
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
    // VIEW ONE USER
    getOneUserStart: (state) => {
      state.isLoading = true;
    },
    getOneUserSuccess: (state) => {
      state.isLoading = false;
    },
    getOneUserFailure: (state) => {
      state.isLoading = false;
    },
    // UPDATE USER
    updateUserStart: (state) => {
      state.isLoading = true;
    },
    updateUserSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    updateUserFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    //DELETE USER
    deleteUserStart: (state) => {
      state.isLoading = true;
    },
    deleteUserSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    // GET TEACHER GROUPS
    getTeacherGroupStart: (state) => {
      state.isLoading = true;
    },
    getTeacherGroupSuccess: (state) => {
      state.isLoading = false;
    },
    getTeacherGroupFailure: (state) => {
      state.isLoading = false;
    },
  },
});
export const {
  getAllUsersStart,
  getAllUsersSuccess,
  getOneUserStart,
  getOneUserSuccess,
  getOneUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  getTeacherGroupStart,
  getTeacherGroupSuccess,
  getTeacherGroupFailure,
} = userSlice.actions;
export default userSlice.reducer;
