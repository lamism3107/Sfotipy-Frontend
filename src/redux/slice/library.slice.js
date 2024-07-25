import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  libraryData: {
    categoryList: ["All"],
    libraryData: [],
    isFetching: false,
    error: false,
  },
  currentCategory: "All",
  currentSort: {
    title: "Thêm gần đây",
    sortBy: "createdAt",
    sort: "desc",
  },
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    addToCategoryList: (state, action) => {
      if (!state.libraryData.categoryList.includes(action.payload)) {
        state.libraryData.categoryList.push(action.payload);
      }
    },
    removeFromCategoryList: (state, action) => {
      const listSameTypeItem = state.libraryData.libraryData.filter(
        (item) => item.codeType === action.payload.codeType
      );
      const indexOfCategory = state.libraryData.categoryList.findIndex(
        (item) => item === action.payload.codeType
      );
      if (listSameTypeItem.length === 0) {
        state.currentCategory = "All";
        state.libraryData.categoryList.splice(indexOfCategory, 1);
      }
    },
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    setCurrentSort: (state, action) => {
      state.currentSort = action.payload;
      let sortBy = action.payload.sortBy;
      let sort = action.payload.sort;

      if (sortBy === "createdAt" && sort === "desc") {
        state.libraryData.libraryData = state.libraryData.libraryData?.sort(
          (a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
        );
      }
      if (sortBy === "createdAt" && sort === "asc") {
        state.libraryData.libraryData = state.libraryData.libraryData?.sort(
          (a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
        );
      }
      if (sortBy === "name" && sort === "asc") {
        state.libraryData.libraryData = state.libraryData.libraryData.sort(
          (a, b) => a.name.localeCompare(b.name)
        );
      }
    },
    fetchLibraryDataSuccess: (state, action) => {
      state.libraryData.libraryData = action.payload.libraryData;
      if (action.payload.categoryList !== state.libraryData.categoryList)
        state.libraryData.categoryList = action.payload.categoryList;
      state.libraryData.isFetching = false;
    },
    fetchLibraryDataFailure: (state, _) => {
      state.libraryData.isFetching = false;
      state.libraryData.error = true;
      state.libraryData.libraryData = [];
      state.libraryData.categoryList = [];
    },
    addItemToLibrary: (state, action) => {
      state.libraryData.libraryData.unshift(action.payload);
      if (!state.libraryData.categoryList.includes(action.payload.codeType)) {
        state.libraryData.categoryList.push(action.payload.codeType);
      }
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
  fetchLibraryDataSuccess,
  fetchLibraryDataFailure,
  addItemToLibrary,
  removeItemFromLibrary,
  editItemOfLibrary,
  addToCategoryList,
  removeFromCategoryList,
  setCurrentCategory,
  setCurrentSort,
} = librarySlice.actions;

export default librarySlice.reducer;
