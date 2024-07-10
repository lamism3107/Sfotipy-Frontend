import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  libraryData: {
    libraryData: [],
    isFetching: false,
    error: false,
  },
  category: {
    categoryList: ["All"],
    currentCategory: "All",
  },
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    addToCategoryList: (state, action) => {
      if (!state.category.categoryList.includes(action.payload)) {
        state.category.categoryList.push(action.payload);
      }
    },
    removeFromCategoryList: (state, action) => {
      const listSameTypeItem = state.libraryData.libraryData.filter(
        (item) => item.codeType === action.payload.codeType
      );
      const indexOfCategory = state.category.categoryList.findIndex(
        (item) => item === action.payload.codeType
      );
      if (listSameTypeItem.length === 0) {
        state.category.currentCategory = "All";
        state.category.categoryList.splice(indexOfCategory, 1);
      }
    },
    setCurrentCategory: (state, action) => {
      state.category.currentCategory = action.payload;
    },
    fetchLibraryDataStart: (state, _) => {
      state.libraryData.isFetching = true;
    },
    fetchLibraryDataSuccess: (state, action) => {
      state.libraryData.libraryData = action.payload.libraryData;
      state.category.categoryList = action.payload.categoryList;
      state.libraryData.isFetching = false;
    },
    fetchLibraryDataFailure: (state, _) => {
      state.libraryData.isFetching = false;
      state.libraryData.error = true;
      state.libraryData.libraryData = [];
      state.category.categoryList = [];
    },
    addItemToLibrary: (state, action) => {
      state.libraryData.libraryData.unshift(action.payload);
    },
    removeItemFromLibrary: (state, action) => {
      const index = state.libraryData.libraryData.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.libraryData.libraryData.splice(index, 1);
      }
    },
    editItemOfLibrary: (state, action) => {
      const albumId = action.payload._id;
      state.libraryData.libraryData.some((album, index) => {
        if (album._id === albumId) {
          state.libraryData.libraryData[index] = action.payload;
          return true;
        }
        return false;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchLibraryDataStart,
  fetchLibraryDataSuccess,
  fetchLibraryDataFailure,
  addItemToLibrary,
  removeItemFromLibrary,
  editItemOfLibrary,
  addToCategoryList,
  removeFromCategoryList,
  setCurrentCategory,
} = librarySlice.actions;

export default librarySlice.reducer;
