import { createAxios } from "../utils/axiosInstance";
import _ from "lodash";

const createNewPlaylist = async (data) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.post(`/playlists`, data);
    return res;
  } catch (err) {
    console.log("error from fetching", err);
  }
};

const getMyPlaylists = async (userId) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.get(`/users/${userId}/playlists`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const getMyAlbums = async (userId) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.get(`/users/${userId}/albums`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const getSongsOfPlaylist = async (albumId) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.get(`/playlists/${albumId}/songs`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
const getPlaylistById = async (id) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.get(`/playlists/${id}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
const deleteMyPlaylistAlbum = async (id) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.delete(`/playlists/${id}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const editMyPlaylistAlbum = async (data) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.put(`/playlists/${data._id}`, data);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

export {
  createNewPlaylist,
  getMyPlaylists,
  getMyAlbums,
  deleteMyPlaylistAlbum,
  editMyPlaylistAlbum,
  getPlaylistById,
  getSongsOfPlaylist,
};
