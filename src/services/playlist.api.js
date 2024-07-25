import _ from "lodash";
import { createAxios } from "../utils/jwtAxios";

const createNewPlaylist = async (data) => {
  const jwtAxios = createAxios();
  const res = await jwtAxios.post(`/playlists`, data);
  return res;
};

const getMyPlaylists = async (userId) => {
  const jwtAxios = createAxios();

  const res = await jwtAxios.get(`/users/${userId}/playlists`);
  return res.data;
};

const getMyAlbums = async (userId) => {
  const jwtAxios = createAxios();
  const res = await jwtAxios.get(`/users/${userId}/albums`);

  return res.data;
};

const getSongsOfPlaylist = async (albumId) => {
  const jwtAxios = createAxios();
  const res = await jwtAxios.get(`/playlists/${albumId}/songs`);
  return res;
};
const getPlaylistById = async (id) => {
  const jwtAxios = createAxios();
  const res = await jwtAxios.get(`/playlists/${id}`);
  return res;
};
const deleteMyPlaylistAlbum = async (id) => {
  const jwtAxios = createAxios();
  const res = await jwtAxios.delete(`/playlists/${id}`);
  return res;
};

const editMyPlaylistAlbum = async (data) => {
  const jwtAxios = createAxios();
  const res = await jwtAxios.put(`/playlists/${data._id}`, data);
  return res;
};

const addSongToPlaylistAlbum = async (playlistId, songId) => {
  const jwtAxios = createAxios();
  const res = await jwtAxios.put(`/playlists/${playlistId}/songs/${songId}`);
  return res;
};
export {
  createNewPlaylist,
  getMyPlaylists,
  getMyAlbums,
  deleteMyPlaylistAlbum,
  editMyPlaylistAlbum,
  getPlaylistById,
  getSongsOfPlaylist,
  addSongToPlaylistAlbum,
};
