import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  groups: null,
  error: null,
  isChange: false,
};

export const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    // GET ALL GROUPS
    getGroupsStart: (state) => {
      state.isLoading = true;
    },
    getGroupsSuccess: (state, action) => {
      state.isLoading = false;
      state.groups = action.payload;
      state.error = null;
    },
    getGroupsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // ADD GROUP
    addGroupStart: (state) => {
      state.isLoading = true;
    },
    addGroupSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    // UPDATE GROUP
    updateGroupStart: (state) => {
      state.isLoading = true;
    },
    updateGroupSuccess: (state) => {
      state.isLoading = false;
      state.isChange = !state.isChange;
    },
    // DELETE GROUP
    deleteGroup: (state) => {
      state.isChange = !state.isChange;
    },
    // ACCESS GROUP
    accessGroupStart: (state) => {
      state.isLoading = true;
    },
    accessGroupSuccess: (state) => {
      state.isLoading = false;
    },
    accessGroupFailure: (state) => {
      state.isLoading = false;
    },
  },
});
export const {
  getGroupsStart,
  getGroupsSuccess,
  getGroupsFailure,
  addGroupStart,
  addGroupSuccess,
  updateGroupStart,
  updateGroupSuccess,
  deleteGroup,
  accessGroupStart,
  accessGroupSuccess,
  accessGroupFailure,
} = groupSlice.actions;
export default groupSlice.reducer;
