import { createSlice } from "@reduxjs/toolkit";
import { userApiSlice } from "api/slicesApi/userApiSlice";

const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
};

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
      state.user = payload.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
    });

    builder.addMatcher(userApiSlice.endpoints.googleAuth.matchFulfilled, (state, { payload }) => {
      state.user = payload.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
    });
    builder.addMatcher(userApiSlice.endpoints.signUp.matchFulfilled, (state, { payload }) => {
      state.user = payload.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
    });
    builder.addMatcher(userApiSlice.endpoints.logout.matchFulfilled, (state) => {
      state.user = null;
      localStorage.removeItem("user");
    });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const currentUser = (state) => state.auth.user;
