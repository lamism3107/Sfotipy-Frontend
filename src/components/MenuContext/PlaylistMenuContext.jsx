"use client";
import React, { useEffect, useRef, useState } from "react";
import { PiQueueBold, PiSecurityCameraThin } from "react-icons/pi";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  closePlaylistMenuContext,
  okConfirmModal,
  openConfirmModal,
} from "../../redux/slice/system.slice";
import * as playlistServices from "../../services/playlistServices";
import * as libraryServices from "../../services/libraryServices";
import {
  createNewAlbumSuccess,
  createNewPlaylistStart,
  createNewPlaylistSuccess,
  deleteAlbum,
  deletePlaylist,
  editAlbumStart,
  editPlaylistStart,
  setCurrentPlaylist,
} from "../../redux/slice/playlist.slice";
import { toast } from "react-toastify";
import { initAlbum, initPlaylist } from "../../constants/initValue";
import {
  addItemToLibrary,
  removeFromCategoryList,
  removeItemFromLibrary,
} from "../../redux/slice/library.slice";
import { usePathname, useRouter } from "next/navigation";
import { LuListMusic } from "react-icons/lu";

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
  isOpenEditModal,
  setIsOpenEditModal,
  setIsOpenPlaylistMenuContext,
  menuContextProps,
}) {
  const pathName = usePathname();
  const menuRef = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const libraryData = useSelector(
    (state) => state.library.libraryData.libraryData
  );
  const reduxMyAlbums = useSelector(
    (state) => state.playlist.myPlaylists.myAlbums
  );
  const reduxMyPlaylists = useSelector(
    (state) => state.playlist.myPlaylists.myPlaylists
  );
  const { target, object, type, top, left } = menuContextProps;
  const user = useSelector((state) => state?.auth?.login?.currentUser);

  const handleOnclickOutside = (e) => {
    const myTarget = document.querySelector(".three-dot");
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      console.log("ditme");
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
        dispatch(removeItemFromLibrary(object));
        dispatch(removeFromCategoryList(object));
      }
      if (object?.owner?._id === user._id) {
        const currentId = pathName.slice(pathName.lastIndexOf("/") + 1);
        if (object?._id === currentId) {
          router.push("/");
        }
        const res2 = await playlistServices.deleteMyPlaylistAlbum(object._id);
        if (object?.codeType === "Album") {
          if (libraryData) {
            dispatch(deleteAlbum(object?._id));
          }
        } else {
          dispatch(deletePlaylist(object?._id));
        }
        if (res2 && res2.success) {
          toast.success(`Xoá ${type} thành công !`);
          return;
        }
      }
      toast.success(`Loại bỏ ${type} khỏi thư viện thành công !`);
    };

    deletePlaylistFromDB();
    dispatch(okConfirmModal());
  };
  //Handle Add playlist
  const handleAddPlaylistAlbum = (type) => {
    const addItemToLibraryDB = async () => {
      if (type === "Album") {
        dispatch(createNewPlaylistStart());
        const res = await playlistServices.createNewPlaylist(
          initAlbum(reduxMyAlbums)
        );
        if (res && res.success) {
          dispatch(createNewAlbumSuccess(res.data));
          dispatch(addItemToLibrary(res.data));
          dispatch(setCurrentPlaylist(res.data));

          const res2 = await libraryServices.addAlbumPlaylistToLibrary(
            res.data._id
          );
          if (res && res2.success) {
            router.push(`/album/${res.data._id}`);
            toast.success("Tạo mới album thành công!");
            return;
          }
        } else {
          toast.error("Tạo mới album thất bại!");
        }
      }
      if (type === "Playlist") {
        dispatch(createNewPlaylistStart());
        const res = await playlistServices.createNewPlaylist(
          initPlaylist(reduxMyPlaylists)
        );
        if (res && res.success) {
          router.push(`/playlist/${res.data._id}`);

          dispatch(addItemToLibrary(res.data));
          dispatch(createNewPlaylistSuccess(res.data));
          dispatch(setCurrentPlaylist(res.data));

          const res2 = await libraryServices.addAlbumPlaylistToLibrary(
            res.data._id
          );
          if (res2 && res2.success) {
            toast.success("Tạo mới playlist thành công!");
            return;
          }
        } else {
          toast.error("Tạo mới một playlist thất bại!");
        }
      }
    };
    addItemToLibraryDB();
  };
  const handleSelectMenu = (id) => {
    //My item
    if (object.owner._id === user._id) {
      if (type === "Album" || type === "Playlist") {
        if (id === 4) {
          handleAddPlaylistAlbum(type);
        }
        if (id === 2) {
          setIsOpenPlaylistMenuContext(false);
          setIsOpenEditModal(true);
          if (type === "Playlist") {
            dispatch(editPlaylistStart(object._id));
          }
          if (type === "Album") {
            dispatch(editAlbumStart(object._id));
          }
        }
        if (id === 3) {
          dispatch(
            openConfirmModal({
              title: `Xoá ${type} `,
              onOk: handleDeletePlaylistAlbum,
              cancelButton: "Huỷ bỏ",
              okButton: "Xoá",
              children: `Bạn thực sự muốn xoá ${object.name}?`,
            })
          );
        }
      }
    } else {
      //User item
      if (type === "Album" || type === "Playlist") {
        if (id === 3) {
          handleAddPlaylistAlbum(type);
        }
        if (id === 2) {
          dispatch(
            openConfirmModal({
              title: `Loại bỏ khỏi thư viện `,
              onOk: handleDeletePlaylistAlbum,
              cancelButton: "Huỷ bỏ",
              okButton: "Loại bỏ",
              children: `Bạn thực sự muốn loại bỏ ${object.name} khỏi thư viện?`,
            })
          );
        }
      }
    }
  };
  console.log("check object", object);
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
