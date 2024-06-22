import { createAxios } from "../utils/axiosInstance";
import _ from "lodash";

const createNewPlaylist = async (token, data) => {
  let axiosJWT = createAxios();

  try {
    const res = await axiosJWT.post(`/playlists`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log("error from fetching", err);
  }
};

const getMyPlaylists = async (token, userId) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.get(`/users/${userId}/playlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

const getMyAlbums = async (token, userId) => {
  let axiosJWT = createAxios();
  try {
    const res = await axiosJWT.get(`/users/${userId}/albums`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (err) {
    console.log("check error", err);
  }
};

export { createNewPlaylist, getMyPlaylists, getMyAlbums };
