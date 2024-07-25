import { createAxios } from "../utils/jwtAxios";
import _ from "lodash";

const jwtAxios = createAxios();

const createNewGenre = async (data) => {
  try {
    const res = await jwtAxios.post(`/genres`, data);
    return res;
  } catch (err) {
    console.log("error from fetching", err);
  }
};

const getAllGenres = async (userId) => {
  try {
    const res = await jwtAxios.get(`/genres`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const getGenreById = async (id) => {
  try {
    const res = await jwtAxios.get(`/genres/${id}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
const deleteGenre = async (id) => {
  try {
    const res = await jwtAxios.delete(`/genres/${id}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const editGenre = async (data) => {
  try {
    const res = await jwtAxios.put(`/genres/${data._id}`, data);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

export { createNewGenre, getAllGenres, deleteGenre, editGenre, getGenreById };
