import { createAxios } from "../utils/axiosInstance";
import { fetcher } from "../utils/fetcher";

import _ from "lodash";

const createNewLibrary = async (data) => {
  try {
    const res = await fetcher.post(`/library`, data);
    return res;
  } catch (err) {
    console.log("error from fetching", err);
  }
};

const getLibraryData = async (category, filter) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.get(
      `/library/?category=${category}&filter=${filter}`
    );
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const addAlbumPlaylistToLibrary = async (playlistId) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.put(`/library/playlist/${playlistId}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const deletePlaylistAlbumFromLibrary = async (playlistId) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.delete(`/library/playlists/${playlistId}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
const searchItemByName = async (category, name) => {
  let axiosJWT = createAxios();
  let categoryURL = "";
  if (category !== "All") {
    categoryURL = `${category.toLowerCase()}s`;
  } else {
    categoryURL = "all";
  }
  try {
    const res = await axiosJWT.get(`/library/${categoryURL}/?name=${name}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
export {
  createNewLibrary,
  getLibraryData,
  deletePlaylistAlbumFromLibrary,
  addAlbumPlaylistToLibrary,
  searchItemByName,
};
