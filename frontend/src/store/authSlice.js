import { createSlice } from "@reduxjs/toolkit";
import { userApiSlice } from "api/slicesApi/userApiSlice";

const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
};
console.log(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearCredentials: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(userApiSlice.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.userInfo = payload.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
    });

    builder.addMatcher(userApiSlice.endpoints.googleAuth.matchFulfilled, (state, { payload }) => {
      state.userInfo = payload.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
    });
    builder.addMatcher(userApiSlice.endpoints.signUp.matchFulfilled, (state, { payload }) => {
      state.userInfo = payload.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
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
export const currentUser = (state) => state.auth.user;
export const isAuthenticated = (state) => !!state.auth.user;
