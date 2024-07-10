"use client";
import React, { useEffect, useRef, useState } from "react";
import { PiQueueBold, PiSecurityCameraThin } from "react-icons/pi";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  closeSongMenuContext,
  okConfirmModal,
  openConfirmModal,
} from "../../redux/slice/system.slice";
import * as playlistServices from "../../services/playlistServices";
import * as libraryServices from "../../services/libraryServices";
import {
  createNewAlbumSuccess,
  createNewSongStart,
  createNewSongSuccess,
  deleteAlbum,
  deleteSong,
  editAlbumStart,
  editSongStart,
  setCurrentSong,
} from "../../redux/slice/playlist.slice";
import { toast } from "react-toastify";
import { initAlbum, initSong } from "../../constants/initValue";
import {
  addItemToLibrary,
  removeFromCategoryList,
  removeItemFromLibrary,
} from "../../redux/slice/library.slice";
import { usePathname, useRouter } from "next/navigation";
import { BiAlbum, BiUserVoice } from "react-icons/bi";
import { LuListMusic } from "react-icons/lu";
import { TbTrashX } from "react-icons/tb";

export const mySongMenu = [
  {
    id: 1,
    title: "Xem chi tiết",
    icon: <LuListMusic className="text-[16px] text-secondaryText" />,
  },
  {
    id: 2,
    title: "Chỉnh sửa chi tiết",
    icon: <FiEdit2 className="text-md text-secondaryText" />,
  },
  {
    id: 3,
    title: "Loại bỏ khỏi album",
    icon: <BiMinusCircle className="text-lg text-secondaryText" />,
  },
  {
    id: 4,
    title: "Xoá",
    icon: <IoMdCloseCircleOutline className="text-lg text-secondaryText" />,
  },
];

export const userSongMenu = [
  {
    id: 1,
    title: "Xem chi tiết",
    icon: <LuListMusic className="text-[16px] text-secondaryText" />,
  },
  {
    id: 2,
    title: "Loại bỏ khỏi playlist",
    icon: <BiMinusCircle className="text-lg text-secondaryText" />,
  },
  {
    id: 3,
    title: "Lưu vào bài hát yêu thích",
    icon: <FiPlusCircle className="text-[16px] text-secondaryText" />,
  },
  {
    id: 4,
    title: "Thêm vào hàng đợi",
    icon: <PiQueueBold className="text-[16px] text-secondaryText" />,
  },
  {
    id: 5,
    title: "Đi tới nghệ sĩ",
    icon: <BiUserVoice className="text-[16px] text-secondaryText" />,
  },
  {
    id: 6,
    title: "Đi tới album",
    icon: <BiAlbum className="text-[16px] text-secondaryText" />,
  },
];
export default function SongMenuContext({
  isOpenEditModal,
  setIsOpenEditModal,
  setIsOpenSongMenuContext,
  menuContextProps,
}) {
  const pathName = usePathname();
  const menuRef = useRef();
  const dispatch = useDispatch();
  const router = useRouter();
  const libraryData = useSelector(
    (state) => state.library.libraryData.libraryData
  );
  const reduxMyAlbums = useSelector((state) => state.playlist.mySongs.myAlbums);
  const reduxMySongs = useSelector((state) => state.playlist.mySongs.mySongs);
  const { target, object, type, top, left } = menuContextProps;
  const user = useSelector((state) => state?.auth?.login?.currentUser);

  const handleOnclickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpenSongMenuContext(false);
    }
    if (target?.current && !target.current.contains(e.target)) {
      setIsOpenSongMenuContext(false);
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
  const handleDeleteSong = () => {
    const deleteSongFromDB = async () => {
      const res = await libraryServices.deleteSongAlbumFromLibrary(object?._id);
      if (res && res.success) {
        dispatch(removeItemFromLibrary(object));
        dispatch(removeFromCategoryList(object));
      }
      if (object?.owner?._id === user._id) {
        const currentId = pathName.slice(pathName.lastIndexOf("/") + 1);
        if (object?._id === currentId) {
          router.push("/");
        }
        const res2 = await playlistServices.deleteMySongAlbum(object._id);
        if (object?.codeType === "Album") {
          if (libraryData) {
            dispatch(deleteAlbum(object?._id));
          }
        } else {
          dispatch(deleteSong(object?._id));
        }
        if (res2 && res2.success) {
          toast.success(`Xoá ${type} thành công !`);
          return;
        }
      }
      toast.success(`Loại bỏ ${type} khỏi thư viện thành công !`);
    };

    deleteSongFromDB();
    dispatch(okConfirmModal());
  };
  //Handle Add playlist
  const handleAddSongAlbum = (type) => {
    const addItemToLibraryDB = async () => {
      if (type === "Album") {
        dispatch(createNewSongStart());
        const res = await playlistServices.createNewSong(
          initAlbum(reduxMyAlbums)
        );
        if (res && res.success) {
          dispatch(createNewAlbumSuccess(res.data));
          dispatch(addItemToLibrary(res.data));
          dispatch(setCurrentSong(res.data));

          const res2 = await libraryServices.addAlbumSongToLibrary(
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
      if (type === "Song") {
        dispatch(createNewSongStart());
        const res = await playlistServices.createNewSong(
          initSong(reduxMySongs)
        );
        if (res && res.success) {
          router.push(`/song/${res.data._id}`);

          dispatch(addItemToLibrary(res.data));
          dispatch(createNewSongSuccess(res.data));
          dispatch(setCurrentSong(res.data));

          const res2 = await libraryServices.addAlbumSongToLibrary(
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
    } else {
      //User item
      if (id === 3) {
        handleAddSongAlbum(type);
      }
      if (id === 2) {
        // dispatch(
        //   openConfirmModal({
        //     title: `Loại bỏ khỏi thư viện `,
        //     onOk: ,
        //     cancelButton: "Huỷ bỏ",
        //     okButton: "Loại bỏ",
        //     children: `Bạn thực sự muốn loại bỏ ${object.name} khỏi thư viện?`,
        //   })
        // );
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
          mySongMenu.map((item, index) => {
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
                  {index === 2 || index === 3 ? `${item.title}` : item.title}{" "}
                </p>
              </div>
            );
          })
        ) : (
          //object.owner._id !== user._id
          <>
            {type === "Song" &&
              mySongMenu.map((item, index) => {
                const lastIndex = mySongMenu.length - 1;
                return (
                  <div
                    onClick={() => {
                      handleSelectMenu(index + 1);
                      setIsOpenSongMenuContext(false);
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
                        ? `${item.title}`
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
