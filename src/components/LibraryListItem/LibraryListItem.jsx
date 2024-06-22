"use client";

import React, { useEffect, useRef, useState } from "react";
import FilterMenu from "../FilterMenu/FilterMenu";
import { FiMenu } from "react-icons/fi";
import SearchLibrary from "../SearchLibrary/SearchLibrary";
import { formatDate } from "../../utils/helperFuncs";
import { MdDeleteForever } from "react-icons/md";
import * as playlistServices from "../../services/playlistServices";
import {
  createNewPlaylistFailure,
  createNewPlaylistStart,
  createNewPlaylistSuccess,
  fetchMyAlbumsSuccess,
  fetchMyPlaylistsSuccess,
} from "../../redux/slice/playlist.slice";
import {
  artistOptions,
  initAlbum,
  initPlaylist,
  userOptions,
} from "../../constants/initValue";
import { useDispatch, useSelector } from "react-redux";
import MenuContext from "../MenuContext/MenuContext";
import useMenuContext from "../../customHooks/useMenuContext";

function LibraryListItem({
  category,
  setCategory,
  myAlbums,
  setMyAlbums,
  myPlaylists,
  setMyPlaylists,
  mySongs,
  setMySongs,
  user,
  role,
  isOpenMenu,
  setIsOpenMenu,
  isOpenModal,
  setIsOpenModal,
}) {
  const dispatch = useDispatch();
  const [filterOpt, setFilterOpt] = useState("Thêm gần đây");
  const buttonFilterRef = useRef(null);

  const showSearchAndFilter = () => {
    if (
      myAlbums?.length > 0 ||
      myPlaylists?.length > 0 ||
      mySongs?.length > 0
    ) {
      return (
        <div className="flex  items-center justify-between pr-2  z-10  mb-3.5 ">
          <SearchLibrary category={category} />
          <button
            ref={buttonFilterRef}
            className="cursor-pointer relative  z-1 outline-none [&_p]:hover:text-white  [&_svg]:hover:text-white transition-all ease-out duration-200  bg-transparent  flex gap-1.5 items-center"
            onClick={() =>
              setIsOpenMenu((prev) => ({
                add: false,
                filter: !prev.filter,
              }))
            }
          >
            <p className="text-sm font-semibold text-secondaryText ">
              {filterOpt}
            </p>
            <FiMenu className="text-xl text-secondaryText" />
            {isOpenMenu.filter && (
              <FilterMenu
                buttonFilterRef={buttonFilterRef}
                isOpen={isOpenMenu}
                setIsOpen={setIsOpenMenu}
                setFilterOpt={setFilterOpt}
                filterOpt={filterOpt}
              />
            )}
          </button>
        </div>
      );
    }
  };
  const showListItem = () => {
    if (category === "album" && myAlbums?.length > 0) {
      return (
        <div className="flex flex-col gap-1 mt-3">
          {myAlbums.map((playlist, id) => (
            <div
              key={id}
              className=" flex gap-2 w-full justify-between hover rounded-md hover:bg-[#1a1a1a]"
            >
              <div
                className="cursor-pointer flex-grow w-5/7 rounded-md p-2 gap-3.5 flex item-center justify-start "
                onContextMenu={(e) => handleContextMenu(e)}
              >
                <div className="w-[50px] h-[50px]">
                  <img
                    className="object-cover rounded-md"
                    src={playlist.url !== "" && "/assets/playlistDefault.png"}
                  />
                </div>
                <div className="flex flex-col  my-1 flex-1">
                  <p className="text-white "> {playlist.name}</p>
                  <p className="text-sm text-secondaryText ">
                    Ngày tạo: {formatDate(playlist.createdAt)}
                  </p>
                </div>
              </div>
              <button className="cursor-pointer w-2/7 mr-2 hover:scale-110">
                <MdDeleteForever className="text-2xl hover:scale-105 transition-all ease-out duration-300" />
              </button>
            </div>
          ))}
        </div>
      );
    }
    if (category === "playlist" && myPlaylists?.length > 0) {
      return (
        <div className="flex flex-col gap-1 mt-3">
          {myPlaylists.map((playlist, id) => (
            <div
              key={id}
              className="flex gap-2 w-full justify-between hover rounded-md hover:bg-[#1a1a1a]"
            >
              <div
                className="cursor-pointer flex-grow w-5/7 rounded-md p-2 gap-3.5 flex item-center justify-start "
                onContextMenu={(e) => handleContextMenu(e)}
              >
                <div className="w-[50px] h-[50px]">
                  <img
                    className="object-cover rounded-md"
                    src={playlist.url !== "" && "/assets/playlistDefault.png"}
                  />
                </div>
                <div className="flex flex-col  my-1 flex-1">
                  <p className="text-white "> {playlist.name}</p>
                  <p className="text-sm text-secondaryText ">
                    Ngày tạo: {formatDate(playlist.createdAt)}
                  </p>
                </div>
              </div>
              <button className="cursor-pointer w-2/7 mr-2 hover:scale-110">
                <MdDeleteForever className="text-2xl hover:scale-105 transition-all ease-out duration-300" />
              </button>
            </div>
          ))}
        </div>
      );
    }
    if (category === "song" && mySongs?.length > 0) {
      return (
        <div className="flex flex-col gap-1 mt-3">
          {mySongs.map((song, id) => (
            <div
              key={id}
              className="flex gap-2 w-full justify-between hover rounded-md hover:bg-[#1a1a1a]"
            >
              <div
                className="cursor-pointer flex-grow w-5/7 rounded-md p-2 gap-3.5 flex item-center justify-start "
                onContextMenu={(e) => handleContextMenu(e)}
              >
                <div className="w-[50px] h-[50px]">
                  <img
                    className="object-cover rounded-md"
                    src={song.url !== "" && "/assets/playlistDefault.png"}
                  />
                </div>
                <div className="flex flex-col  my-1 flex-1">
                  <p className="text-white "> {song.name}</p>
                  <p className="text-sm text-secondaryText ">
                    Ngày tạo: {formatDate(song.createdAt)}
                  </p>
                </div>
              </div>
              <button className="cursor-pointer w-2/7 mr-2 hover:scale-110">
                <MdDeleteForever className="text-2xl hover:scale-105 transition-all ease-out duration-300" />
              </button>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-2 ">
          {artistOptions.map((item, id) => (
            <div key={id} className=" tertiary_bg rounded-lg py-5 px-4 ">
              <p className="leading-7 mb-1 font-bold text-md ">{item.title}</p>
              <p className=" text-sm text-semibold">{item.desc}</p>
              <button
                className="cursor-pointer rounded-full text-black mt-4 px-3 py-1.5 bg-white font-semibold text-sm hover:scale-105 transiton-all ease-out duration-150"
                onClick={() => handleClickButtonAdd(item.type)}
              >
                {item.button}
              </button>
            </div>
          ))}
        </div>
      );
    }
  };
  useEffect(() => {
    showListItem();
  }, [category]);

  const handleClickButtonAdd = async (type) => {
    if (type === "album") {
      setCategory("album");
      dispatch(createNewPlaylistStart());
      const res = await playlistServices.createNewPlaylist(
        user.accessToken,
        initAlbum(myAlbums)
      );
      if (res && res.success) {
        dispatch(createNewPlaylistSuccess(res.data));
        setMyAlbums((prev) => [...prev, res.data]);
        dispatch(fetchMyAlbumsSuccess(myPlaylists));
        return;
      } else {
        dispatch(createNewPlaylistFailure());
      }
    }
    if (type === "playlist") {
      setCategory("playlist");

      dispatch(createNewPlaylistStart());
      const res = await playlistServices.createNewPlaylist(
        user.accessToken,
        initPlaylist(myPlaylists)
      );
      if (res && res.success) {
        dispatch(createNewPlaylistSuccess(res.data));
        setMyPlaylists((prev) => [...prev, res.data]);
        dispatch(fetchMyPlaylistsSuccess(myPlaylists));
        return;
      } else {
        dispatch(createNewPlaylistFailure());
      }
    }
  };

  //Menu Context props & function
  const { clicked, setClicked, points, setPoints } = useMenuContext();
  const handleContextMenu = (e) => {
    e.preventDefault();
    setClicked(true);
    setPoints({
      x: e.pageX,
      y: e.pageY,
    });
    console.log("Right Click", e.pageX, e.pageY);
  };

  const containerCss = () => {
    if (user) {
      if (myAlbums?.length > 0 || myPlaylists?.length > 0) {
        return "mt-[92px]  h-[350px]";
      } else {
        return "mt-[52px] h-[400px]";
      }
    } else {
      return "mt-[44px]";
    }
  };
  return (
    <div
      className={`relative z-1 your_library 
      ${containerCss()}  
      overflow-y-scroll`}
    >
      {user ? (
        <>
          {showSearchAndFilter()}
          {role === "artist" ? (
            <>{showListItem()}</>
          ) : (
            <>
              {userOptions.map((item, id) => (
                <div
                  key={id}
                  className=" mt-3 ml-2 tertiary_bg rounded-lg py-5 px-4 "
                >
                  <p className="font-bold text-md leading-7 mb-1">
                    {item.title}
                  </p>
                  <p className=" text-sm text-semibold">{item.desc}</p>
                  <button
                    className="rounded-full text-black mt-4 px-3 py-1.5 bg-white font-semibold text-sm hover:scale-105 transiton-all ease-out duration-150"
                    onClick={() => {
                      // setCategory(item.type);
                      handleClickButtonAdd(item.type);
                    }}
                  >
                    {item.button}
                  </button>
                </div>
              ))}
            </>
          )}
        </>
      ) : (
        <div className=" mt-2 tertiary_bg rounded-lg py-5 px-4 ">
          <p className="font-bold text-md leading-7">
            Tạo danh sách phát đầu tiên của bạn
          </p>
          <p className=" text-sm font-semibold">
            Rất dễ, chúng tôi sẽ giúp bạn
          </p>
          <button
            onClick={() => setIsOpenModal(true)}
            className="rounded-full text-black mt-4 px-3 py-1.5 bg-white font-semibold text-sm hover:scale-105 transiton-all ease-out duration-150"
          >
            Tạo danh sách phát
          </button>
        </div>
      )}
    </div>
  );
}

export default LibraryListItem;
