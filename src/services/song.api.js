import { createAxios } from "../utils/jwtAxios";

import _ from "lodash";

const createNewSong = async (data) => {
  const jwtAxios = createAxios();

  try {
    const res = await jwtAxios.post(`/songs`, data);
    return res;
  } catch (err) {
    console.log("error from fetching", err);
  }
};

const getMySongs = async (userId) => {
  let jwtAxios = createAxios();
  try {
    const res = await jwtAxios.get(`/users/${userId}/songs`);
    return res.data;
  } catch (err) {
    console.log("check error", err);
  }
};

const getAllSongs = async () => {
  let jwtAxios = createAxios();
  try {
    const res = await jwtAxios.get(`/songs`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
const getSongById = async (id) => {
  let jwtAxios = createAxios();
  try {
    const res = await jwtAxios.get(`/songs/${id}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
const deleteMySong = async (id) => {
  let jwtAxios = createAxios();
  try {
    const res = await jwtAxios.delete(`/songs/${id}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const editMySong = async (data) => {
  let jwtAxios = createAxios();
  try {
    const res = await jwtAxios.put(`/songs/${data._id}`, data);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

export {
  createNewSong,
  getMySongs,
  deleteMySong,
  editMySong,
  getSongById,
  getAllSongs,
};
