import { createAxios } from "../utils/axiosInstance";
import _ from "lodash";

const createNewSong = async (data) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.post(`/songs`, data);
    return res;
  } catch (err) {
    console.log("error from fetching", err);
  }
};

const getMySongs = async (userId) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.get(`/users/${userId}/songs`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const getSongById = async (id) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.get(`/songs/${id}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
const deleteMySong = async (id) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.delete(`/songs/${id}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const editMySong = async (data) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.put(`/songs/${data._id}`, data);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

export { createNewSong, getMySongs, deleteMySong, editMySong, getSongById };
