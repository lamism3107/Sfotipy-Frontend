// import { deleteToken, setToken } from "@/redux/slice/token.slice";
// import { logoutUser } from "@/redux/slice/user.slice";
// import { store } from "@/redux/store";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { refreshToken } from "../services/authServices";
import { store } from "../redux/store";
import { loginSuccess } from "../redux/slice/auth.slice";

const config = {
  BASE_URL: "http://localhost:8000/api",
  TIME_OUT: 30000,
};

export const fetcher = axios.create({
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
  baseURL: config.BASE_URL,
  timeout: config.TIME_OUT,
});

//Config request gửi đi
fetcher.interceptors.request.use(
  async function (request) {
    return request;
  },
  function (error) {
    return Promise.reject(error);
  }
);

fetcher.interceptors.response //Config response nhận về
  .use(
    function (response) {
      console.log("check response", response);

      return response && response.data ? response.data : response;
    },
    function (error) {
      if (error && error.response && error.response.data) {
        console.log("check error", error);

        return error.response.data;
      }

      // return Promise.reject(error);
      console.log("check error", error);
    }
  );
