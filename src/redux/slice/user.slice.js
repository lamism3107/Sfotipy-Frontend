import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allUsers: {
    allUsers: null,
    isFetching: false,
    error: false,
  },
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchAllUsersStart: (state, _) => {
      state.allUsers.isFetching = true;
    },
    fetchAllUsersSuccess: (state, action) => {
      state.allUsers = {
        allUsers: action.payload,
        isFetching: false,
      };
    },
    fetchAllUsersFailure: (state, _) => {
      state.allUsers = {
        isFetching: false,
        error: true,
        allUsers: null,
      };
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchAllUsersStart,
  fetchAllUsersSuccess,
  fetchAllUsersFailure,
  setCurrentUser,
} = userSlice.actions;

export default userSlice.reducer;
