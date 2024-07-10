import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  myPlaylists: {
    myPlaylists: [],
    myAlbums: [],
    isFetching: false,
    error: false,
  },
  currentPlaylist: null,
  createNewAlbum: {
    isFetching: false,
    error: false,
    album: null,
  },
  createNewPlaylist: {
    isFetching: false,
    error: false,
  },
  deletePlaylist: {
    isFetching: false,
    error: false,
    id: null,
  },
  editPlaylist: {
    editingPlaylist: null,
    editingAlbum: null,
  },
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    createNewPlaylistStart: (state, action) => {
      state.createNewPlaylist.isFetching = true;
      state.createNewPlaylist.error = false;
    },
    createNewPlaylistSuccess: (state, action) => {
      console.log(action);
      state.createNewPlaylist.isFetching = false;
      state.createNewPlaylist.error = false;
      state.myPlaylists.myPlaylists.push(action.payload);
    },
    createNewAlbumSuccess: (state, action) => {
      state.createNewPlaylist.isFetching = false;
      state.createNewPlaylist.error = false;
      state.myPlaylists.myAlbums.push(action.payload);
    },
    fetchMyPlaylistsStart: (state, _) => {
      state.myPlaylists.isFetching = true;
      state.myPlaylists.myPlaylists = [];
      state.myPlaylists.error = false;
    },
    fetchMyPlaylistsSuccess: (state, action) => {
      console.log(action);
      state.myPlaylists.isFetching = false;
      state.myPlaylists.myPlaylists = action.payload;
    },
    fetchMyPlaylistsFailure: (state, _) => {
      state.myPlaylists.isFetching = false;
      state.myPlaylists.error = true;
      state.myPlaylists.myPlaylists = [];
    },
    fetchMyAlbumsStart: (state, _) => {
      state.myPlaylists.isFetching = true;
      state.myPlaylists.myAlbums = [];
      state.myPlaylists.error = false;
    },
    fetchMyAlbumsSuccess: (state, action) => {
      state.myPlaylists.myAlbums = action.payload;
      state.myPlaylists.isFetching = false;
    },
    fetchMyAlbumsFailure: (state, _) => {
      state.myPlaylists.isFetching = false;
      state.myPlaylists.error = true;
    },
    deletePlaylist: (state, action) => {
      console.log(action);
      const playlistId = action.payload;
      console.log("check current playlist", current(state));
      const foundPlaylistIndex = state.myPlaylists.myPlaylists.findIndex(
        (playlist) => playlist._id === playlistId
      );
      if (foundPlaylistIndex !== -1) {
        state.myPlaylists.myPlaylists.splice(foundPlaylistIndex, 1);
      }
    },
    deleteAlbum: (state, action) => {
      const albumId = action.payload;
      console.log("check current album", current(state));
      const foundAlbumIndex = state.myPlaylists.myAlbums.findIndex(
        (album) => album._id === albumId
      );
      if (foundAlbumIndex !== -1) {
        state.myPlaylists.myAlbums.splice(foundAlbumIndex, 1);
      }
    },
    editPlaylistStart: (state, action) => {
      const playlistId = action.payload;
      const foundPlaylist =
        state.myPlaylists.myPlaylists.find(
          (playlist) => playlist._id === playlistId
        ) || null;
      state.editPlaylist.editingPlaylist = foundPlaylist;
    },
    editPlaylistCancel: (state) => {
      state.editPlaylist.editingPlaylist = null;
    },
    editPlaylistSuccess: (state, action) => {
      const playlistId = action.payload._id;
      state.myPlaylists.myPlaylists.some((playlist, index) => {
        if (playlist._id === playlistId) {
          state.myPlaylists.myPlaylists[index] = action.payload;
          return true;
        }
        return false;
      });
      state.editPlaylist.editingPlaylist = null;
    },
    editAlbumStart: (state, action) => {
      const albumId = action.payload;
      const foundAlbum =
        state.myPlaylists.myAlbums.find((album) => album._id === albumId) ||
        null;
      state.editPlaylist.editingAlbum = foundAlbum;
    },
    editAlbumCancel: (state) => {
      state.editPlaylist.editingAlbum = null;
    },
    editAlbumSuccess: (state, action) => {
      const albumId = action.payload._id;
      state.myPlaylists.myAlbums.some((album, index) => {
        if (album._id === albumId) {
          state.myPlaylists.myAlbums[index] = action.payload;
          return true;
        }
        return false;
      });

      state.editPlaylist.editingAlbum = null;
    },
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchMyPlaylistsStart,
  fetchMyPlaylistsSuccess,
  fetchMyPlaylistsFailure,
  createNewPlaylistStart,
  createNewPlaylistSuccess,
  createNewAlbumSuccess,
  fetchMyAlbumsStart,
  fetchMyAlbumsSuccess,
  fetchMyAlbumsFailure,
  deletePlaylist,
  deleteAlbum,
  editPlaylistStart,
  editPlaylistCancel,
  editPlaylistSuccess,
  editAlbumStart,
  editAlbumSuccess,
  editAlbumCancel,
  setCurrentPlaylist,
} = playlistSlice.actions;

export default playlistSlice.reducer;
