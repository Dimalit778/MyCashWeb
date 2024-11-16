import { createSlice } from "@reduxjs/toolkit";
import { authApiSlice } from "services/api/authApi";

const initialState = {
  user: null,
  categories: {
    income: [],
    expense: [],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    clearUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApiSlice.endpoints.login.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
      })
      .addMatcher(authApiSlice.endpoints.googleAuth.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
      })
      .addMatcher(authApiSlice.endpoints.signUp.matchFulfilled, (state, { payload }) => {
        state.user = payload.user;
      })
      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, (state) => {
        return initialState;
      })
      .addMatcher(authApiSlice.endpoints.getCategories.matchFulfilled, (state, { payload }) => {
        state.categories = payload;
      });
  },
});

export const { setUser, setCategories, clearUser } = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const currentUser = (state) => state.root.user.user;
export const userCategories = (state) => state.root.user.categories;
