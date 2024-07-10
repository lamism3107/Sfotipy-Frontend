import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  confirmModal: {
    isOpen: false,
    title: "",
    onOk: () => {},
    cancelButton: "",
    okButton: "",
    className: "",
    children: null,
  },
  editPlaylistModal: {
    isOpen: false,
    title: "",
    onOk: () => {},
    form: null,
    okButton: "",
    cancelButton: "",
    className: "",
    children: null,
  },
};

const systemSlice = createSlice({
  name: "system",
  initialState,
  reducers: {
    openConfirmModal: (state, action) => {
      state.confirmModal = {
        isOpen: true,
        title: action.payload.title,
        onOk: action.payload.onOk,
        cancelButton: action.payload.cancelButton,
        okButton: action.payload.okButton,
        children: action.payload?.children,
      };
    },
    cancelConfirmModal: (state, action) => {
      state.confirmModal = {
        isOpen: false,
        title: "",
        onOk: () => {},
        cancelButton: "",
        okButton: "",
        className: "",
        children: null,
      };
    },
    okConfirmModal: (state, action) => {
      state.confirmModal = {
        isOpen: false,
        title: "",
        onOk: () => {},
        cancelButton: "",
        okButton: "",
        className: "",
        children: null,
      };
    },

    openEditPlaylistModal: (state, action) => {
      state.editPlaylistModal = {
        isOpen: true,
        title: action.payload.title,
        onOk: action.payload.onOk,
        cancelButton: action.payload.cancelButton,
        okButton: action.payload.okButton,
        children: action.payload?.children,
      };
    },
    cancelEditPlaylistModal: (state, action) => {
      state.editPlaylistModal = {
        isOpen: false,
        title: "",
        onOk: () => {},
        cancelButton: "",
        okButton: "",
        className: "",
        children: null,
      };
    },
    okEditPlaylistModal: (state, action) => {
      state.confirmModal = {
        isOpen: false,
        title: "",
        onOk: () => {},
        cancelButton: "",
        okButton: "",
        className: "",
        children: null,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  openPlaylistMenuContext,
  closePlaylistMenuContext,
  openConfirmModal,
  cancelConfirmModal,
  okConfirmModal,
} = systemSlice.actions;

export default systemSlice.reducer;
