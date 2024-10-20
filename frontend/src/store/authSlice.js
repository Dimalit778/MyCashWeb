import { createSlice } from "@reduxjs/toolkit";
import { userApiSlice } from "api/slicesApi/userApiSlice";

const initialState = {
  userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApiSlice.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.userInfo = payload.user;
      localStorage.setItem("userInfo", JSON.stringify(payload.user));
    });
    builder.addMatcher(userApiSlice.endpoints.logout.matchFulfilled, (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.userInfo;
export const selectIsAuthenticated = (state) => !!state.auth.userInfo;
