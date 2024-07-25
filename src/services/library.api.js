import { fetcher } from "../utils/fetcher";
import { createAxios } from "../utils/jwtAxios";

import _ from "lodash";

const createNewLibrary = async (data) => {
  const jwtAxios = createAxios();

  const res = await jwtAxios.post(`/library`, data);
  return res;
};

const getLibraryData = async (category) => {
  const jwtAxios = createAxios();

  const res = await jwtAxios.get(`/library/?category=${category}`);
  return res.data;
};

const addAlbumPlaylistToLibrary = async (playlistId) => {
  const jwtAxios = createAxios();

  const res = await jwtAxios.put(`/library/playlist/${playlistId}`);
  return res;
};

const addSongToLibrary = async (songId) => {
  const jwtAxios = createAxios();

  const res = await jwtAxios.put(`/library/song/${songId}`);
  return res;
};

const deletePlaylistAlbumFromLibrary = async (playlistId) => {
  const jwtAxios = createAxios();

  const res = await jwtAxios.delete(`/library/playlists/${playlistId}`);
  return res;
};
const searchItemByName = async (category, name, sort, sortBy) => {
  const jwtAxios = createAxios();
  const res = await jwtAxios.get(
    `/library/${category}/?name=${name}&sort=${sort}&sortBy=${sortBy}`
  );
  return res;
};
export {
  createNewLibrary,
  getLibraryData,
  deletePlaylistAlbumFromLibrary,
  addAlbumPlaylistToLibrary,
  searchItemByName,
  addSongToLibrary,
};
