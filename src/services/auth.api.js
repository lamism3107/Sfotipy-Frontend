import { createAxios } from "../utils/jwtAxios";
import { fetcher } from "../utils/fetcher";

const login = async (data) => {
  try {
    const res = await fetcher.post(`/auth/login`, data);
    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};

const register = async (data) => {
  try {
    const res = await fetcher.post(`/auth/register`, data);
    return res;
  } catch (e) {
    console.log("Error: ", e);
  }
};

const loginWithGoogle = async (token) => {
  try {
    const res = await fetcher.get(`/auth/loginWithGoogle`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (e) {
    console.log("error from fetching", e);
  }
};

const refreshToken = async (id) => {
  try {
    const res = await fetcher.post(`/auth/refreshToken`, id, {
      withCredentials: true,
    });
    return res.data;
  } catch (e) {
    console.log("error from fetching", e);
  }
};

const logout = async (token, id) => {
  let axiosJWT = createAxios();

  try {
    const res = await axiosJWT.post(`/auth/logout`, id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log("error from fetching", err);
  }
};
const logoutGG = async (id) => {
  try {
    const res = await fetcher.post(`/auth/logoutGG`, id);
    return res;
  } catch (err) {
    console.log("error from fetching", err);
  }
};

const sessionPersist = async (refreshTokenCookie) => {
  const decodedToken = jwtDecode(refreshTokenCookie);
  const id = decodedToken.id;
  const data = await refreshToken({ userId: id });

  // let axiosRefreshJWT = createAxiosRefresh();
  try {
    const res = await fetcher.post(
      `/auth/sessionPersist`,
      { userId: id },
      {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      }
    );
    return res;
  } catch (err) {
    console.log("error from fetching", err);
  }
};
export {
  login,
  register,
  loginWithGoogle,
  refreshToken,
  logout,
  logoutGG,
  sessionPersist,
};
