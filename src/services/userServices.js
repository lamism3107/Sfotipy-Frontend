import {
  fetchAllUsersFailure,
  fetchAllUsersStart,
  fetchAllUsersSuccess,
} from "../redux/slice/user.slice";
import { fetcher } from "../utils/axios";

export const fetchAllUsers = async (accessToken, dispatch) => {
  dispatch(fetchAllUsersStart());

  try {
    const res = await fetcher.get("/api/users");
    dispatch(fetchAllUsersSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch(fetchAllUsersFailure());
  }
};
