"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BiSolidHome, BiLibrary } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as playlistService from "../../services/playlistServices";
import PillTag from "../PillTag/PillTag";
import {
  createNewAlbumSuccess,
  createNewPlaylistStart,
  createNewPlaylistSuccess,
  fetchMyAlbumsFailure,
  fetchMyAlbumsStart,
  fetchMyAlbumsSuccess,
  fetchMyPlaylistsFailure,
  fetchMyPlaylistsStart,
  fetchMyPlaylistsSuccess,
  setCurrentPlaylist,
} from "../../redux/slice/playlist.slice";
import { AddMenu } from "../AddMenu/AddMenu";
import LibraryListItem from "../LibraryListItem/LibraryListItem";
import Tooltip from "../ToolTip/ToolTip";
import { toast } from "react-toastify";
import * as playlistServices from "../../services/playlistServices";
import * as songServices from "../../services/songServices";
import * as libraryServices from "../../services/libraryServices";
import _ from "lodash";
import { initAlbum, initPlaylist } from "../../constants/initValue";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import Signup from "../Sidebar/Signup";
import {
  addItemToLibrary,
  fetchLibraryDataFailure,
  fetchLibraryDataStart,
  fetchLibraryDataSuccess,
  setCurrentCategory,
} from "../../redux/slice/library.slice";
import {
  fetchMySongsFailure,
  fetchMySongsStart,
  fetchMySongsSuccess,
} from "../../redux/slice/song.slice";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const reduxMyPlaylists = useSelector(
    (state) => state?.playlist?.myPlaylists.myPlaylists
  );
  const reduxMyAlbums = useSelector(
    (state) => state?.playlist?.myPlaylists.myAlbums
  );
  const reduxLibraryData = useSelector(
    (state) => state.library.libraryData.libraryData
  );
  const reduxCategoryList = useSelector(
    (state) => state.library.category.categoryList
  );
  const reduxCurrentCategory = useSelector(
    (state) => state.library.category.currentCategory
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const buttonAddRef = useRef(null);
  const [isOpenMenu, setIsOpenMenu] = useState({
    add: false,
    filter: false,
  });

  useEffect(() => {
    if (user) {
      //Fetch my playlists
      dispatch(fetchMyPlaylistsStart());
      const getAllMyPlayList = async () => {
        const res = await playlistService.getMyPlaylists(user?._id);
        if (res?.success) {
          dispatch(fetchMyPlaylistsSuccess(res.data));
        } else {
          dispatch(fetchMyPlaylistsFailure());
        }
      };
      getAllMyPlayList();

      //Fetch my albums
      dispatch(fetchMyAlbumsStart());
      const getAllMyAlbum = async () => {
        const res = await playlistService.getMyAlbums(user?._id);
        if (res?.success) {
          dispatch(fetchMyAlbumsSuccess(res.data));
        } else {
          dispatch(fetchMyAlbumsFailure());
        }
      };
      getAllMyAlbum();

      //Fetch my songs
      dispatch(fetchMySongsStart());
      const getAllMySongs = async () => {
        const res = await songServices.getMySongs(user?._id);
        if (res?.success) {
          dispatch(fetchMySongsSuccess(res.data));
        } else {
          dispatch(fetchMySongsFailure());
        }
      };
      getAllMySongs();
    }
  }, []);

  useEffect(() => {
    const getLibaryData = async () => {
      dispatch(fetchLibraryDataStart());
      const res = await libraryServices.getLibraryData(
        reduxCurrentCategory,
        "-createdAt"
      );
      if (res?.success) {
        let libraryData = res.data.libraryData;
        let categoryList = res.data.categoryList;
        dispatch(
          fetchLibraryDataSuccess({
            libraryData: libraryData,
            categoryList: categoryList,
          })
        );
      } else {
        dispatch(fetchLibraryDataFailure());
      }
    };
    // if (reduxCurrentCategory !== "All") {
    getLibaryData();
    // }
  }, [reduxCurrentCategory]);

  const handleSelect = (type) => {
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
    setIsOpenMenu((prev) => ({
      add: false,
      filter: false,
    }));
  };
  const handleClickPillTag = async (item) => {
    dispatch(setCurrentCategory(item));
  };
  return (
    <div className="w-1/4 relative z-10 resize-x mt-2 ml-2 sidebar ">
      {/* >>>>>>> Home & Search  <<<<<<<<*/}
      <div className="nav secondary_bg rounded-lg py-6 px-5">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-4 text-secondaryText cursor-pointer hover:text-white transition-all ease-out duration-150"
        >
          <BiSolidHome className="font-bold text-xl" />
          <span className="font-semibold">Trang chủ</span>
        </div>
        <div
          onClick={() => router.push("/search")}
          className="flex mt-4 items-center gap-4 text-secondaryText cursor-pointer hover:text-white transition-all ease-out duration-150"
        >
          <FiSearch className="font-bold text-xl" />
          <span className="font-semibold">Tìm kiếm</span>
        </div>
      </div>

      {/* >>>>>>> Library  <<<<<<<<<< */}
      <div className="mt-2 secondary_bg rounded-lg pl-3 py-2 h-[480px] overflow-y-hidden">
        <div className="  z-40 bg-secondaryBg  ">
          <div className="flex  px-2 justify-between mt-2 mb-2 items-center gap-4  z-100   ">
            <div className="flex gap-2 items-center text-secondaryText cursor-pointer">
              <BiLibrary className="font-bold text-xl " />
              <span className="font-semibold text-[md]">Thư viện</span>
            </div>
            <button
              ref={buttonAddRef}
              onClick={() =>
                setIsOpenMenu((prev) => {
                  return { add: !prev.add, filter: false };
                })
              }
              className="outline-none relative z-10 hover:bg-[#232323] rounded-[50%] p-2 "
            >
              <FaPlus className=" text-[md] font-light" />
              {isOpenMenu.add && (
                <AddMenu
                  handleSelect={handleSelect}
                  setIsOpenMenu={setIsOpenMenu}
                  buttonAddRef={buttonAddRef}
                  isOpen={isOpenMenu}
                  setIsOpen={setIsOpenMenu}
                />
              )}
            </button>
            <Tooltip content="Thêm mới album hoặc bài hát" />
          </div>

          <div className="flex gap-2 items-center mt-3 mb-3 px-2">
            {reduxLibraryData.length > 0 && (
              <>
                {reduxCurrentCategory === "All" ? (
                  reduxCategoryList?.map((item, index) => (
                    <div key={index} onClick={() => handleClickPillTag(item)}>
                      <PillTag
                        active={reduxCurrentCategory === item}
                        content={item}
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex items-center  gap-2">
                    <button
                      className="p-1.5 bg-tertiaryBg text-secondaryText hover:bg-white hover:text-black rounded-full"
                      onClick={() => dispatch(setCurrentCategory("All"))}
                    >
                      <IoClose />
                    </button>
                    <div className="">
                      <PillTag active={true} content={reduxCurrentCategory} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <LibraryListItem
          libraryData={reduxLibraryData}
          user={user}
          myAlbums={reduxMyAlbums}
          myPlaylists={reduxMyPlaylists}
          isOpenMenu={isOpenMenu}
          setIsOpenMenu={setIsOpenMenu}
        />
      </div>
      {!user && <Signup />}
    </div>
  );
};

export default Sidebar;
