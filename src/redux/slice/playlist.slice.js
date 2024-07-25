import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  currentPlaylist: null,
  editingPlaylist: null,
  editingAlbum: null,
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    setEditingPlaylist: (state, action) => {
      state.editingPlaylist = action.payload;
    },
    setEditingAlbum: (state, action) => {
      state.editingAlbum = action.payload;
    },
    // editAlbumStart: (state, action) => {
    //   const albumId = action.payload;
    //   const foundAlbum =
    //     state.myPlaylists.myAlbums.find((album) => album._id === albumId) ||
    //     null;
    //   state.editPlaylist.editingAlbum = foundAlbum;
    // },
    // editAlbumCancel: (state) => {
    //   state.editPlaylist.editingAlbum = null;
    // },
    // editAlbumSuccess: (state, action) => {
    //   const albumId = action.payload._id;
    //   state.myPlaylists.myAlbums.some((album, index) => {
    //     if (album._id === albumId) {
    //       state.myPlaylists.myAlbums[index] = action.payload;
    //       return true;
    //     }
    //     return false;
    //   });

    //   state.editPlaylist.editingAlbum = null;
    // },
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setEditingPlaylist, setEditingAlbum, setCurrentPlaylist } =
  playlistSlice.actions;

export default playlistSlice.reducer;
