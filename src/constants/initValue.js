import { store } from "../redux/store";
import _ from "lodash";
// const state = store.getState();
// const user = state.auth.login.currentUser;

export const initAlbum = (myAlbums) => {
  let state = store.getState();
  let user = state.auth.login.currentUser;
  // let myAlbums = _.cloneDeep(state.playlist?.myPlaylists?.myAlbums);
  let count = myAlbums.length;
  let defaultAlbum = {
    name: `Album #${count + 1} `,
    thumbnail: "/assets/playlistDefault.png",
    owner: user?._id,
    songs: [],
    isAlbum: true,
    artist: user?._id,
    collaborators: [],
  };
  return defaultAlbum;
};

export const initPlaylist = (myPlaylists) => {
  let state = store.getState();
  let user = state.auth.login.currentUser;
  // let myPlaylists = _.cloneDeep(state.playlist.myPlaylists.myPlaylists);
  let count = myPlaylists.length;
  let defaultPlaylist = {
    name: `Playlist #${count + 1} `,
    thumbnail: "/assets/playlistDefault.png",
    owner: user?._id,
    songs: [],
    isAlbum: false,
    collaborators: [],
  };
  return defaultPlaylist;
};

export const artistOptions = [
  {
    type: "album",
    title: "Tạo album đầu tiên của bạn",
    desc: "Rất dễ, chúng tôi sẽ giúp bạn",
    button: "Tạo mới album",
  },
  {
    type: "playlist",
    title: "Tạo playlist đầu tiên của bạn",
    desc: "Rất dễ, chúng tôi sẽ giúp bạn",
    button: "Tạo mới playlist",
  },
  {
    type: "song",
    title: "Tạo bài hát đầu tiên của bạn",
    desc: "Hãy thêm bài hát của bạn và chia sẻ với mọi người cùng nghe nhé!",
    button: "Tạo mới bài hát",
  },
];

export const userOptions = [
  {
    type: "playlist",
    title: "Tạo playlist đầu tiên của bạn",
    desc: "Rất dễ, chúng tôi sẽ giúp bạn",
    button: "Tạo mới playlist",
  },
];
