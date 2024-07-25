"use client";
import React, { useRef, memo, useState, useEffect } from "react";
import { BiSolidHome, BiLibrary } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import PillTag from "../PillTag/PillTag";
import { setCurrentPlaylist } from "../../redux/slice/playlist.slice";
import { AddMenu } from "../AddMenu/AddMenu";
import LibraryListItem from "../LibraryListItem/LibraryListItem";
import Tooltip from "../ToolTip/ToolTip";
import { toast } from "react-toastify";
import * as playlistServices from "../../services/playlist.api.js";
import * as songServices from "../../services/song.api.js";
import * as libraryServices from "../../services/library.api.js";
import _ from "lodash";
import { initAlbum, initPlaylist } from "../../constants/initValue";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import {
  setCurrentCategory,
  setCurrentSort,
} from "../../redux/slice/library.slice";
import useSWR, { mutate } from "swr";
import CreateSongModal from "../CreateSongModal/CreateSongModal.jsx";
import {
  useAlbumLibrary,
  useAllLibrary,
  useArtistLibrary,
  useMyAlbums,
  useMyPlaylists,
  useMySongs,
  usePlaylistLibrary,
  useSongLibrary,
} from "../../app/customHooks/librarySWRHooks.js";

const Sidebar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const buttonAddRef = useRef(null);
  const [isOpenMenu, setIsOpenMenu] = useState({
    add: false,
    filter: false,
  });
  const [isOpenCreateSongModal, setIsOpenCreateSongModal] = useState(false);
  const user = useSelector((state) => state.auth.login.currentUser);
  const reduxCurrentCategory = useSelector(
    (state) => state.library.currentCategory
  );
  const swrMyAlbum = useMyAlbums(user._id);
  const swrMySong = useMySongs(user._id);
  const swrMyPlaylist = useMyPlaylists(user._id);
  const swrAllLibrary = useAllLibrary();
  const swrAlbumLibrary = useAlbumLibrary();
  const swrSongLibrary = useSongLibrary();
  const swrPlaylistLibrary = usePlaylistLibrary();
  const swrArtistLibrary = useArtistLibrary();
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

  const handleSelectAdd = (type) => {
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
                  newLibraryData.unshift(res.data);
                  let newCategoryList = [...data.categoryList];
                  let findIndex = data.categoryList.findIndex(
                    (item) => item === res.data.codeType
                  );
                  if (findIndex === -1) {
                    newCategoryList.push(res.data.codeType);
                  }
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
                  let findIndex = data.categoryList.findIndex(
                    (item) => item === res.data.codeType
                  );
                  if (findIndex === -1) {
                    newCategoryList.push(res.data.codeType);
                  }
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
                  let findIndex = newCategoryList.findIndex(
                    (item) => item === res.data.codeType
                  );
                  if (findIndex === -1) {
                    newCategoryList.push(res.data.codeType);
                  }
                  console.log(findIndex);
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
                  let findIndex = data.categoryList.findIndex(
                    (item) => item === res.data.codeType
                  );
                  if (findIndex === -1) {
                    newCategoryList.push(res.data.codeType);
                  }
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
      if (type === "Song") {
        setIsOpenCreateSongModal(true);
      }
    };
    addItemToLibraryDB();
    setIsOpenMenu((prev) => ({
      add: false,
      filter: false,
    }));
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
      <div className="mt-2 secondary_bg rounded-lg pl-3  py-2 h-[480px] overflow-y-hidden">
        <div className="  z-40 bg-secondaryBg  ">
          <div className="flex  px-2  justify-between mt-2 mb-2 items-center gap-4  z-100   ">
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
                  handleSelect={handleSelectAdd}
                  setIsOpenMenu={setIsOpenMenu}
                  buttonAddRef={buttonAddRef}
                  isOpen={isOpenMenu}
                  setIsOpen={setIsOpenMenu}
                />
              )}
            </button>
            <Tooltip content="Thêm mới album hoặc bài hát" />
          </div>

          <div className="flex gap-2 items-center mt-3 mb-3 px-2 overflow-x-auto  ">
            {/* {reduxLibraryData?.length > 0 && ( */}
            <>
              {reduxCurrentCategory === "All" ? (
                libraryData?.categoryList?.map((item, index) => (
                  <div
                    key={index}
                    onClick={async () => {
                      const res = await mutate(
                        `/library/?category=${item}`,
                        (data) => data,
                        false
                      );
                      if (res) dispatch(setCurrentCategory(item));
                      dispatch(
                        setCurrentSort({
                          title: "Thêm gần đây",
                          sortBy: "createdAt",
                          sort: "desc",
                        })
                      );
                    }}
                  >
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
                    onClick={async () => {
                      const res = await swrAllLibrary.mutate();
                      if (res) dispatch(setCurrentCategory("All"));
                      dispatch(
                        setCurrentSort({
                          title: "Thêm gần đây",
                          sortBy: "createdAt",
                          sort: "desc",
                        })
                      );
                    }}
                  >
                    <IoClose />
                  </button>
                  <div className="">
                    <PillTag active={true} content={reduxCurrentCategory} />
                  </div>
                </div>
              )}
            </>
            {/* )} */}
          </div>
        </div>
        <LibraryListItem
          user={user}
          myAlbums={swrMyAlbum?.data}
          myPlaylists={swrMyPlaylist?.data}
          isOpenMenu={isOpenMenu}
          setIsOpenMenu={setIsOpenMenu}
        />
      </div>
      {isOpenCreateSongModal && (
        <CreateSongModal
          isOpen={isOpenCreateSongModal}
          setIsOpen={setIsOpenCreateSongModal}
          album={null}
        />
      )}
    </div>
  );
};

export default memo(Sidebar);
