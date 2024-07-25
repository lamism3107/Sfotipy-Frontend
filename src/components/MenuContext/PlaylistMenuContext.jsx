"use client";
import React, { useEffect, useRef, useState } from "react";
import { PiQueueBold } from "react-icons/pi";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import * as playlistServices from "../../services/playlist.api.js";
import * as libraryServices from "../../services/library.api.js";
import {
  setCurrentPlaylist,
  setEditingAlbum,
  setEditingPlaylist,
} from "../../redux/slice/playlist.slice";
import { toast } from "react-toastify";
import { initAlbum, initPlaylist } from "../../constants/initValue";
import { setCurrentCategory } from "../../redux/slice/library.slice";
import useSWR, { mutate } from "swr";
import { usePathname, useRouter } from "next/navigation";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import {
  useAlbumLibrary,
  useAllLibrary,
  useArtistLibrary,
  useMyAlbums,
  useMyPlaylists,
  usePlaylistLibrary,
  useSongLibrary,
} from "../../app/customHooks/librarySWRHooks.js";

export const myPlaylistMenu = [
  {
    id: 1,
    title: "Thêm vào hàng đợi",
    icon: <PiQueueBold className="text-[16px] text-secondaryText" />,
  },
  {
    id: 2,
    title: "Chỉnh sửa chi tiết",
    icon: <FiEdit2 className="text-md text-secondaryText" />,
  },
  {
    id: 3,
    title: "Xoá",
    icon: <IoMdCloseCircleOutline className="text-lg text-secondaryText" />,
  },
  {
    id: 4,
    title: "Tạo mới ",
    icon: <FiPlusCircle className="text-[16px] text-secondaryText" />,
  },
];
export const userPlaylistMenu = [
  {
    id: 1,
    title: "Thêm vào hàng đợi",
    icon: <PiQueueBold className="text-[16px] text-secondaryText" />,
  },
  {
    id: 2,
    title: "Loại bỏ khỏi thư viện",
    icon: <IoMdCloseCircleOutline className="text-lg text-secondaryText" />,
  },
  {
    id: 3,
    title: "Tạo mới ",
    icon: <FiPlusCircle className="text-[16px] text-secondaryText" />,
  },
];

export default function PlaylistMenuContext({
  confirmModalProps,
  setConfirmModalProps,
  isOpenConfirmModal,
  setIsOpenConfirmModal,
  isOpenEditModal,
  setIsOpenEditModal,
  setIsOpenPlaylistMenuContext,
  menuContextProps,
}) {
  const pathName = usePathname();
  const menuRef = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);
  const swrMyAlbum = useMyAlbums(user._id);
  const swrMyPlaylist = useMyPlaylists(user._id);
  const swrAlbumData = useAlbumLibrary();
  const swrAllData = useAllLibrary();
  const swrSongData = useSongLibrary();
  const swrPlaylistData = usePlaylistLibrary();
  const swrArtistData = useArtistLibrary();
  const reduxCurrentCategory = useSelector(
    (state) => state.library.currentCategory
  );
  const {
    data: libraryData,
    isLoading: isLoadingLibraryData,
    mutate: mutateLibraryData,
  } = useSWR(
    `/library/?category=${reduxCurrentCategory}`,
    () => libraryServices.getLibraryData(reduxCurrentCategory),
    {
      dedupingInterval: 3000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const { target, object, type, top, left } = menuContextProps;

  const handleOnclickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpenPlaylistMenuContext(false);
    }
    if (target?.current && !target.current.contains(e.target)) {
      setIsOpenPlaylistMenuContext(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOnclickOutside);
    return () => {
      document.removeEventListener("click", handleOnclickOutside);
    };
  }, []);
  useEffect(() => {
    document.addEventListener("contextmenu", handleOnclickOutside);
    return () => {
      document.removeEventListener("contextmenu", handleOnclickOutside);
    };
  }, []);

  //Handle Delete playlist
  const handleDeletePlaylistAlbum = () => {
    const deletePlaylistFromDB = async () => {
      const res = await libraryServices.deletePlaylistAlbumFromLibrary(
        object?._id
      );
      if (res && res.success) {
        if (object?.codeType !== reduxCurrentCategory) {
          swrAlbumData.mutate();
          mutate(
            `/library/?category=${reduxCurrentCategory}`,
            async (data) => {
              let newLibraryData = [...data.libraryData];
              let newCategoryList = [...data.categoryList];
              newLibraryData = newLibraryData.filter(
                (data) => data._id !== res.data._id
              );
              const listSameTypeItem = data.libraryData.filter(
                (item) => item.codeType === res.data.codeType
              );
              if (listSameTypeItem.length === 1) {
                newCategoryList = [...data.categoryList].filter(
                  (item) => item !== res.data.codeType
                );
              }
              return {
                libraryData: newLibraryData,
                categoryList: newCategoryList,
              };
            },
            false
          );
        } else {
          const newLibraryData = await swrAllData.mutate();
          if (libraryData.libraryData.length === 1 && newLibraryData) {
            console.log("hello", newLibraryData);
            dispatch(setCurrentCategory("All"));
          }
          mutate(
            `/library/?category=${reduxCurrentCategory}`,
            async (data) => {
              {
                let newLibraryData = [...data.libraryData];
                let newCategoryList = [...data.categoryList];
                newLibraryData = newLibraryData.filter(
                  (data) => data._id !== res.data._id
                );
                const listSameTypeItem = data.libraryData.filter(
                  (item) => item.codeType === res.data.codeType
                );
                if (listSameTypeItem.length === 1) {
                  newCategoryList = [...data.categoryList].filter(
                    (item) => item !== res.data.codeType
                  );
                }
                return {
                  libraryData: newLibraryData,
                  categoryList: newCategoryList,
                };
              }
            },
            false
          );
        }
      }
      if (object?.owner?._id === user._id) {
        const currentId = pathName.slice(pathName.lastIndexOf("/") + 1);
        if (object?._id === currentId) {
          router.push("/");
        }
        const res2 = await playlistServices.deleteMyPlaylistAlbum(object._id);
        if (object?.codeType === "Album") {
          mutate(
            `/users/${user._id}/albums`,
            (data) => {
              const newMyAlbums = [...data].filter(
                (item) => item._id !== res.data._id
              );

              return newMyAlbums;
            },
            false
          );
        } else {
          mutate(
            `/users/${user._id}/playlists`,
            (data) => {
              const newMyPlaylists = [...data].filter(
                (item) => item._id !== res.data._id
              );
              return newMyPlaylists;
            },
            false
          );
        }
        if (res2 && res2.success) {
          toast.success(`Xoá ${type} thành công !`);
          return;
        }
      }
      toast.success(`Loại bỏ ${type} khỏi thư viện thành công !`);
    };

    deletePlaylistFromDB();
    setIsOpenConfirmModal(false);
  };

  //Handle Add playlist
  const handleAddPlaylistAlbum = (type) => {
    const addItemToLibraryDB = async () => {
      if (type === "Album") {
        const res = await playlistServices.createNewPlaylist(
          initAlbum(swrMyAlbum?.data)
        );
        if (res && res.success) {
          router.push(`/album/${res.data._id}`);
          dispatch(setCurrentPlaylist(res.data));
          mutate(
            `/users/${user._id}/albums`,
            (data) => {
              let newMyAlbums = [...data];
              newMyAlbums.unshift(res.data);
              return newMyAlbums;
            },
            false
          );
          const res2 = await libraryServices.addAlbumPlaylistToLibrary(
            res.data._id
          );
          if (res2 && res2.success) {
            toast.success("Tạo mới album thành công!");
            if (res.data.codeType !== reduxCurrentCategory) {
              dispatch(setCurrentCategory("All"));
              mutate(
                `/library/?category=All`,
                (data) => {
                  let newLibraryData = [...data.libraryData];
                  let newCategoryList = [...data.categoryList];
                  newLibraryData.unshift(res.data);
                  return {
                    categoryList: newCategoryList,
                    libraryData: newLibraryData,
                  };
                },
                false
              );
              mutate(`/library/?category=${res.data.codeType}`);
            } else {
              mutate(
                `/library/?category=${reduxCurrentCategory}`,
                (data) => {
                  let newLibraryData = [...data.libraryData];
                  let newCategoryList = [...data.categoryList];
                  newLibraryData.unshift(res.data);
                  return {
                    categoryList: newCategoryList,
                    libraryData: newLibraryData,
                  };
                },
                false
              );
            }
            return;
          }
        } else {
          toast.error("Tạo mới album thất bại!");
        }
      }
      if (type === "Playlist") {
        const res = await playlistServices.createNewPlaylist(
          initPlaylist(swrMyPlaylist?.data)
        );
        if (res && res.success) {
          router.push(`/playlist/${res.data._id}`);
          dispatch(setCurrentPlaylist(res.data));
          swrMyPlaylist?.mutate((data) => {
            let newMyPlaylists = [...data];
            newMyPlaylists.unshift(res.data);
            return newMyPlaylists;
          }, false);
          const res2 = await libraryServices.addAlbumPlaylistToLibrary(
            res.data._id
          );
          if (res2 && res2.success) {
            toast.success("Tạo mới danh sách phát thành công!");
            if (res.data.codeType !== reduxCurrentCategory) {
              dispatch(setCurrentCategory("All"));
              mutate(
                `/library/?category=All`,
                (data) => {
                  let newLibraryData = [...data.libraryData];
                  let newCategoryList = [...data.categoryList];
                  newLibraryData.unshift(res.data);
                  return {
                    categoryList: newCategoryList,
                    libraryData: newLibraryData,
                  };
                },
                false
              );
              mutate(`/library/?category=${res.data.codeType}`);
            } else {
              mutate(
                `/library/?category=${reduxCurrentCategory}`,
                (data) => {
                  let newLibraryData = [...data.libraryData];
                  let newCategoryList = [...data.categoryList];
                  newLibraryData.unshift(res.data);
                  return {
                    categoryList: newCategoryList,
                    libraryData: newLibraryData,
                  };
                },
                false
              );
            }
            return;
          }
        } else {
          toast.error("Tạo mới danh sách phát thất bại!");
        }
      }
    };
    addItemToLibraryDB();
  };

  const handleSelectMenu = (id) => {
    if (object.owner._id === user._id) {
      if (type === "Album" || type === "Playlist") {
        if (id === 4) {
          handleAddPlaylistAlbum(type);
        }
        if (id === 2) {
          setIsOpenPlaylistMenuContext(false);
          setIsOpenEditModal(true);
          if (type === "Playlist") {
            const foundPlaylist =
              swrMyPlaylist.data.find(
                (playlist) => playlist._id === object._id
              ) || null;
            dispatch(setEditingPlaylist(foundPlaylist));
          }
          if (type === "Album") {
            const foundAlbum =
              swrMyAlbum.data.find((album) => album._id === object._id) || null;
            dispatch(setEditingPlaylist(foundAlbum));
          }
        }
        if (id === 3) {
          setIsOpenConfirmModal(true);
          setConfirmModalProps({
            title: "Loại bỏ khỏi thư viện",
            onOk: handleDeletePlaylistAlbum,
            cancelButton: "Huỷ bỏ",
            okButton: "Loại bỏ",
            children: `Bạn thực sự muốn loại bỏ ${object.name} khỏi thư viện?`,
          });
        }
      }
    } else {
      //User item
      if (type === "Album" || type === "Playlist") {
        if (id === 3) {
          handleAddPlaylistAlbum(type);
        }
        if (id === 2) {
          setConfirmModalProps({
            title: "Loại bỏ khỏi thư viện",
            onOk: handleDeletePlaylistAlbum,
            cancelButton: "Huỷ bỏ",
            okButton: "Loại bỏ",
            children: `Bạn thực sự muốn loại bỏ ${object.name} khỏi thư viện?`,
          });
          setIsOpenConfirmModal(true);
        }
      }
    }
  };
  return (
    <div className="absolute inset-0">
      <div
        ref={menuRef}
        style={
          !target
            ? {
                top: `${top > 450 ? top - 170 : top + 12}px`,
                left: `${left}px`,
              }
            : {
                top: `${top > 450 ? top - 180 : top + 4}px`,
                left: `${left > 1300 ? left - 560 : left - 404}px`,
              }
        }
        className={` absolute bg-[#282828] rounded-md  min-w-[100px] min-h-[100px]  `}
      >
        {object?.owner._id === user._id ? (
          <>
            {type === "Playlist" &&
              myPlaylistMenu.map((item, index) => {
                const lastIndex = myPlaylistMenu.length - 1;
                return (
                  <div
                    onClick={() => {
                      handleSelectMenu(index + 1);
                      setIsOpenPlaylistMenuContext(false);
                    }}
                    key={index}
                    className={`min-w-[180px] cursor-default w-full flex items-center ${
                      index === 0 && "mt-1"
                    } ${
                      index === lastIndex && "mb-1"
                    } text-sm p-2.5    gap-3 bg-[#282828] hover:bg-[#323232] `}
                  >
                    <div>{item.icon}</div>
                    <p>
                      {index === 2 || index === 3
                        ? `${item.title} ${type}`
                        : item.title}{" "}
                    </p>
                  </div>
                );
              })}

            {type === "Album" &&
              myPlaylistMenu.map((item, index) => {
                const lastIndex = myPlaylistMenu.length - 1;
                return (
                  <div
                    onClick={() => {
                      handleSelectMenu(index + 1);
                      setIsOpenPlaylistMenuContext(false);
                    }}
                    key={index}
                    className={`min-w-[180px] cursor-default w-full flex items-center ${
                      index === 0 && "mt-1"
                    } ${
                      index === lastIndex && "mb-1"
                    } text-sm p-2.5    gap-3 bg-[#282828] hover:bg-[#323232] `}
                  >
                    <div>{item.icon}</div>
                    <p>
                      {index === 2 || index === 3
                        ? `${item.title} ${type}`
                        : item.title}{" "}
                    </p>
                  </div>
                );
              })}
          </>
        ) : (
          //object.owner._id !== user._id
          <>
            {type === "Playlist" &&
              userPlaylistMenu.map((item, index) => {
                const lastIndex = myPlaylistMenu.length - 1;
                return (
                  <div
                    onClick={() => {
                      handleSelectMenu(index + 1);
                      setIsOpenPlaylistMenuContext(false);
                    }}
                    key={index}
                    className={`min-w-[180px] cursor-default w-full flex items-center ${
                      index === 0 && "mt-1"
                    } ${
                      index === lastIndex && "mb-1"
                    } text-sm p-2.5    gap-3 bg-[#282828] hover:bg-[#323232] `}
                  >
                    <div>{item.icon}</div>
                    <p>
                      {index === 2 || index === 3
                        ? `${item.title} ${type}`
                        : item.title}{" "}
                    </p>
                  </div>
                );
              })}

            {type === "Album" &&
              userPlaylistMenu.map((item, index) => {
                const lastIndex = myPlaylistMenu.length - 1;
                return (
                  <div
                    onClick={() => {
                      handleSelectMenu(index + 1);
                      setIsOpenPlaylistMenuContext(false);
                    }}
                    key={index}
                    className={`min-w-[180px] cursor-default w-full flex items-center ${
                      index === 0 && "mt-1"
                    } ${
                      index === lastIndex && "mb-1"
                    } text-sm p-2.5    gap-3 bg-[#282828] hover:bg-[#323232] `}
                  >
                    <div>{item.icon}</div>
                    <p>
                      {index === 2 || index === 3
                        ? `${item.title} ${type}`
                        : item.title}{" "}
                    </p>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
