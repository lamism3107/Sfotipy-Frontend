import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "../services/auth.api";
import { store } from "../redux/store";
import { loginSuccess } from "../redux/slice/auth.slice";

const config = {
  BASE_URL: "http://localhost:8000/api",
  // BASE_URL: "https://sfotipy-backend.vercel.app/api",

  TIME_OUT: 10000,
};

export const createAxios = () => {
  const newInstance = axios.create({
    baseURL: config.BASE_URL,
    timeout: config.TIME_OUT,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      //   Authorization: "Bearer " + accessToken
    },
  });
  newInstance.interceptors.request.use(
    async function (request) {
      const state = store.getState();
      const user = state?.auth?.login?.currentUser;

      const decodedToken = jwtDecode(user.accessToken);

      let date = new Date();

      if (decodedToken.exp < date.getTime() / 1000) {
        const data = await refreshToken({ userId: user._id });
        const refreshUser = {
          ...user,
          accessToken: data.accessToken,
        };
        store.dispatch(loginSuccess(refreshUser));
        request.headers["Authorization"] = "Bearer " + data.accessToken;
        // request.headers.Authorization = "Bearer" + user?.accessToken;
      } else {
        request.headers["Authorization"] = "Bearer " + user?.accessToken;
      }
      return request;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  newInstance.interceptors.response //Config response nhận về
    .use(
      function (response) {
        return response && response.data ? response.data : response;
      },
      function (error) {
        if (error && error.response && error.response) {
          return error.response;
        }
        console.log("error", error.response);
        return Promise.reject(error);
      }
    );

  return newInstance;
};
