import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  register: {
    success: false,
    isFetching: false,
    existedEmail: "",
    error: false,
  },
  logout: {
    isFetching: false,
    error: false,
  },
  token: {
    accessToken: "",
  },
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    loginStart: (state, _) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login = {
        currentUser: action.payload,
        isFetching: false,
        error: false,
      };
    },
    loginFailure: (state, _) => {
      state.login = {
        currentUser: null,
        isFetching: false,
        error: true,
      };
    },
    registerStart: (state, _) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state, action) => {
      state.register = {
        success: true,
        isFetching: false,
        existedEmail: action.payload,
        error: false,
      };
    },
    registerFailure: (state, action) => {
      state.register = {
        success: false,
        isFetching: false,
        existedEmail: action.payload,
        error: true,
      };
    },
    logoutStart: (state) => {
      state.logout = {
        isFetching: true,
        error: false,
      };
    },
    logoutSuccess: (state) => {
      state.logout.isFetching = false;
      state.login.currentUser = null;
      state.logout.error = false;
    },
    logoutFailure: (state, _) => {
      state.logout = {
        isFetching: false,
        error: true,
      };
    },
    setAccessToken: (_, action) => {
      state.token.accessToken = action.payload;
    },
    deleteAccessToken: () => {
      state.token.accessToken = "";
    },
    // logout: (state, action) => {
    //   state.logout = action.payload;
    // },
  },
});

export const {
  loginSuccess,
  loginFailure,
  loginStart,
  registerStart,
  registerSuccess,
  registerFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  setAccessToken,
  deleteAccessToken,
} = authSlice.actions;
export default authSlice.reducer;
