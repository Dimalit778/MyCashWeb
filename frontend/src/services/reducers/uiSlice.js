import { createSelector, createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    selectedDate: new Date().toISOString().split("T")[0],
    transactionModal: {
      isOpen: false,
      type: null,
      editItem: null,
    },
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    openTransactionModal: (state, action) => {
      state.transactionModal = {
        isOpen: true,
        type: action.payload.type || null,
        editItem: action.payload.editItem || null,
      };
    },
    closeTransactionModal: (state) => {
      state.transactionModal = {
        isOpen: false,
        type: null,
        editItem: null,
      };
    },
  },
});

export const { setSelectedDate, openTransactionModal, closeTransactionModal } = uiSlice.actions;

export default uiSlice.reducer;
export const uiState = (state) => state.root.ui;

// Memoized selectors
export const selectedDateString = createSelector([uiState], (ui) => ui.selectedDate);
export const transactionModal = createSelector([uiState], (ui) => ui.transactionModal);
export const selectedDateObject = createSelector(
  [selectedDateString],
  (selectedDateString) => new Date(selectedDateString)
);
