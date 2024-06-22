import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mySongs: {
    mySongs: [],
    isFetching: false,
    error: false,
  },
  createNewSong: {
    isFetching: false,
    error: false,
    song: null,
  },
};

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    createNewSongStart: (state, action) => {
      state.createNewSong.isFetching = true;
      state.createNewSong.error = false;
      state.createNewSong.song = null;
    },
    createNewSongSuccess: (state, action) => {
      state.createNewSong = {
        isFetching: false,
        error: false,
        song: action.payload,
      };
    },
    createNewSongFailure: (state, action) => {
      state.createNewSong = {
        isFetching: false,
        error: true,
        song: null,
      };
    },
    fetchMySongsStart: (state, _) => {
      state.mySongs = {
        isFetching: true,
        mySongs: [],
        error: false,
      };
    },
    fetchMySongsSuccess: (state, action) => {
      state.mySongs = {
        mySongs: action.payload,
        isFetching: false,
      };
    },
    fetchMySongsFailure: (state, _) => {
      state.mySongs = {
        isFetching: false,
        error: true,
        mySongs: [],
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchMySongsStart,
  fetchMySongsSuccess,
  fetchMySongsFailure,
  createNewSongStart,
  createNewSongFailure,
  createNewSongSuccess,
} = songSlice.actions;

export default songSlice.reducer;
