import useSWR from "swr";
import * as libraryAPI from "../../services/library.api";
import * as playlistAPI from "../../services/playlist.api";
import * as songAPI from "../../services/song.api";
import { store } from "../../redux/store";

export const usePlaylistLibrary = () => {
  return useSWR(
    `/library/?category=Playlist`,
    () => libraryAPI.getLibraryData("Playlist"),

    {
      dedupingInterval: 3000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );
};
export const useAlbumLibrary = () => {
  return useSWR(
    `/library/?category=Album`,
    () => libraryAPI.getLibraryData("Album"),
    {
      revalidateIfStale: false,
      dedupingInterval: 3000,
      revalidateOnFocus: false,
    }
  );
};
export const useAllLibrary = () => {
  return useSWR(
    `/library/?category=All`,
    () => libraryAPI.getLibraryData("All"),
    {
      revalidateIfStale: false,
      dedupingInterval: 3000,
      revalidateOnFocus: false,
    }
  );
};
export const useSongLibrary = () => {
  return useSWR(
    `/library/?category=Song`,
    () => libraryAPI.getLibraryData("Song"),
    {
      // revalidateIfStale: false,
      revalidateOnFocus: false,
      dedupingInterval: 3000,
    }
  );
};
export const useArtistLibrary = () => {
  return useSWR(
    `/library/?category=Artist`,
    () => libraryAPI.getLibraryData("Artist"),
    {
      revalidateIfStale: false,
      dedupingInterval: 3000,
      revalidateOnFocus: false,
    }
  );
};
export const useMyAlbums = (userId) => {
  return useSWR(
    `/users/${userId}/albums`,
    () => playlistAPI.getMyAlbums(userId),
    {
      revalidateIfStale: false,
      dedupingInterval: 3000,
      revalidateOnFocus: false,
    }
  );
};
export const useMyPlaylists = (userId) => {
  return useSWR(
    `/users/${userId}/playlists`,
    () => playlistAPI.getMyPlaylists(userId),
    {
      revalidateIfStale: false,
      dedupingInterval: 3000,
      revalidateOnFocus: false,
    }
  );
};
export const useMySongs = (userId) => {
  return useSWR(`/users/${userId}/songs`, () => songAPI.getMySongs(userId), {
    revalidateIfStale: false,
    dedupingInterval: 3000,
    revalidateOnFocus: false,
  });
};
