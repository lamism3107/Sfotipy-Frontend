import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myPlaylists: {
    myPlaylists: [],
    myAlbums: [],
    isFetching: false,
    error: false,
  },
  createNewAlbum: {
    isFetching: false,
    error: false,
    album: null,
  },
  createNewPlaylist: {
    isFetching: false,
    error: false,
    playlist: null,
  },
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    createNewPlaylistStart: (state, action) => {
      state.createNewPlaylist.isFetching = true;
      state.createNewPlaylist.error = false;
      state.createNewPlaylist.playlist = null;
    },
    createNewPlaylistSuccess: (state, action) => {
      state.createNewPlaylist = {
        isFetching: false,
        error: false,
        playlist: action.payload,
      };
    },
    createNewPlaylistFailure: (state, action) => {
      state.createNewPlaylist = {
        isFetching: false,
        error: true,
        playlist: null,
      };
    },

    fetchMyPlaylistsStart: (state, _) => {
      state.myPlaylists = {
        isFetching: true,
        myPlaylists: [],
        error: false,
      };
    },
    fetchMyPlaylistsSuccess: (state, action) => {
      state.myPlaylists = {
        myPlaylists: action.payload,
        isFetching: false,
      };
    },
    fetchMyPlaylistsFailure: (state, _) => {
      state.myPlaylists = {
        isFetching: false,
        error: true,
        myPlaylists: [],
      };
    },
    fetchMyAlbumsStart: (state, _) => {
      state.myPlaylists = {
        isFetching: true,
        myAlbums: [],
        error: false,
      };
    },
    fetchMyAlbumsSuccess: (state, action) => {
      state.myPlaylists = {
        myAlbums: action.payload,
        isFetching: false,
      };
    },
    fetchMyAlbumsFailure: (state, _) => {
      state.myPlaylists = {
        isFetching: false,
        error: true,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchMyPlaylistsStart,
  fetchMyPlaylistsSuccess,
  fetchMyPlaylistsFailure,
  createNewPlaylistStart,
  createNewPlaylistFailure,
  createNewPlaylistSuccess,
  fetchMyAlbumsStart,
  fetchMyAlbumsSuccess,
  fetchMyAlbumsFailure,
} = playlistSlice.actions;

export default playlistSlice.reducer;
