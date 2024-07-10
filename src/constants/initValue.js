import { store } from "../redux/store";
import _ from "lodash";
// const state = store.getState();
// const user = state.auth.login.currentUser;

export const initAlbum = (myAlbums) => {
  let state = store.getState();
  let user = state.auth.login.currentUser;
  let count = myAlbums.length;
  let defaultAlbum = {
    name: `My Album #${count + 1} `,
    thumbnail: "",
    owner: user?._id,
    codeType: "Album",
    songs: [],
    description: "",
    artist: user._id,
    collaborators: [],
  };
  return defaultAlbum;
};

export const initPlaylist = (myPlaylists) => {
  let state = store.getState();
  let user = state.auth.login.currentUser;
  let count = myPlaylists.length;
  let defaultPlaylist = {
    name: `My Playlist #${count + 1} `,
    thumbnail: "",
    owner: user._id,
    codeType: "Playlist",
    songs: [],
    collaborators: [],
    description: "",
  };
  return defaultPlaylist;
};

export const artistOptions = [
  {
    type: "Album",
    title: "Tạo album đầu tiên của bạn",
    desc: "Rất dễ, chúng tôi sẽ giúp bạn",
    button: "Tạo mới album",
  },
  {
    type: "Playlist",
    title: "Tạo playlist đầu tiên của bạn",
    desc: "Rất dễ, chúng tôi sẽ giúp bạn",
    button: "Tạo mới playlist",
  },
  {
    type: "Song",
    title: "Tạo bài hát đầu tiên của bạn",
    desc: "Hãy thêm bài hát của bạn và chia sẻ với mọi người cùng nghe nhé!",
    button: "Tạo mới bài hát",
  },
];

export const userOptions = [
  {
    type: "Playlist",
    title: "Tạo playlist đầu tiên của bạn",
    desc: "Rất dễ, chúng tôi sẽ giúp bạn",
    button: "Tạo mới playlist",
  },
];
