import { createSelector, createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    selectedDate: new Date().toISOString().split("T")[0],
    transactionModal: {
      isOpen: false,
      type: null, // 'income' or 'expense'
      editingId: null,
    },
    // You might also want to add other UI states
    currentView: "monthly", // or 'yearly'
    filterType: "all", // 'expense', 'income', 'all'
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    openTransactionModal: (state, action) => {
      state.transactionModal = {
        isOpen: true,
        type: action.payload.type || null,
        editingId: action.payload.editingId || null,
      };
    },
    closeTransactionModal: (state) => {
      state.transactionModal = {
        isOpen: false,
        type: null,
        editingId: null,
      };
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
  },
});

export const { setSelectedDate, openTransactionModal, closeTransactionModal, setCurrentView, setFilterType } =
  uiSlice.actions;

export default uiSlice.reducer;
export const uiState = (state) => state.root.ui;
// Memoized selectors
export const selectedDateString = createSelector([uiState], (ui) => ui.selectedDate);
export const transactionModal = createSelector([uiState], (ui) => ui.transactionModal);
export const selectedDateObject = createSelector(
  [selectedDateString],
  (selectedDateString) => new Date(selectedDateString)
);
