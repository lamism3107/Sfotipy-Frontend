import { createAxios } from "../utils/jwtAxios";

export const fetchAllUsers = async (name) => {
  let jwtAxios = createAxios();
  try {
    const res = await jwtAxios.get(`/users`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
export const getArtistByName = async (name) => {
  let jwtAxios = createAxios();
  try {
    const res = await jwtAxios.get(`/users/?role=artist&name=${name}`);
    return res;
  } catch (err) {
    console.log("check error", err);
  }
};
