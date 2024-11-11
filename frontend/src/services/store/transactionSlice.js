import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: new Date(),
  modalType: null,
  editingItem: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setModalType: (state, action) => {
      state.modalType = action.payload;
    },
    setEditingItem: (state, action) => {
      state.editingItem = action.payload;
    },
    resetModal: (state) => {
      state.modalType = null;
      state.editingItem = null;
    },
  },
});

export const { setDate, setModalType, setEditingItem, resetModal } = transactionSlice.actions;

// Selectors
export const selectDate = (state) => state.root.transaction.date;
export const selectModalType = (state) => state.root.transaction.modalType;
export const selectEditingItem = (state) => state.root.transaction.editingItem;

export default transactionSlice.reducer;
