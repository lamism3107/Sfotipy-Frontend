"use client";
import React, { useEffect, useRef, useState } from "react";
import { BiSolidHome, BiLibrary } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as playlistService from "../../services/playlistServices";
import PillTag from "../PillTag/PillTag";
import {
  createNewPlaylistFailure,
  createNewPlaylistStart,
  createNewPlaylistSuccess,
  fetchMyAlbumsFailure,
  fetchMyAlbumsStart,
  fetchMyAlbumsSuccess,
  fetchMyPlaylistsFailure,
  fetchMyPlaylistsStart,
  fetchMyPlaylistsSuccess,
} from "../../redux/slice/playlist.slice";
import { fetchAllUsersFailure } from "../../redux/slice/user.slice";
import { AddMenu } from "../AddMenu/AddMenu";
import LibraryListItem from "../LibraryListItem/LibraryListItem";
import Tooltip from "../ToolTip/ToolTip";
import Modal from "../ConfirmModal/ConfirmModal";
import { toast, ToastContainer } from "react-toastify";
import * as playlistServices from "../../services/playlistServices";
import _ from "lodash";
import { initAlbum, initPlaylist } from "../../constants/initValue";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const user = useSelector((state) => state?.auth?.login?.currentUser);
  const reduxMyPlaylists = useSelector(
    (state) => state?.playlist?.myPlaylists?.myPlaylists
  );
  const reduxMyAlbums = useSelector(
    (state) => state?.playlist?.myPlaylists?.myAlbums
  );

  const dispatch = useDispatch();
  const router = useRouter();
  const buttonAddRef = useRef(null);
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("");
  const [isOpenMenu, setIsOpenMenu] = useState({
    add: false,
    filter: false,
  });
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [myAlbums, setMyAlbums] = useState([]);
  const [mySongs, setMySongs] = useState([]);

  useEffect(() => {
    if (user) {
      //Fetch my playlists
      dispatch(fetchMyPlaylistsStart());
      const getAllMyPlayList = async () => {
        const res = await playlistService.getMyPlaylists(
          user?.accessToken,
          user?._id
        );
        if (res?.success) {
          dispatch(fetchMyPlaylistsSuccess(res.data));
          setMyPlaylists(res.data);
        } else {
          dispatch(fetchMyPlaylistsFailure());
        }
      };
      getAllMyPlayList();

      //Fetch my albums
      dispatch(fetchMyAlbumsStart());
      const getAllMyAlbum = async () => {
        const res = await playlistService.getMyAlbums(
          user?.accessToken,
          user?._id
        );
        if (res?.success) {
          dispatch(fetchMyAlbumsSuccess(res.data));
          setMyAlbums(res.data);
        } else {
          dispatch(fetchMyAlbumsFailure());
        }
      };
      getAllMyAlbum();

      //Fetch my songs

      setRole(user?.role);
    }
  }, []);
  useEffect(() => {
    if (reduxMyAlbums) {
      setCategory("album");
    } else {
      if (reduxMyPlaylists) {
        setCategory("playlist");
      }
    }
  }, []);
  // useEffect(() => {
  //   setMyPlaylists(reduxMyPlaylists);
  //   setMyAlbums(reduxMyAlbums);
  // }, [reduxMyAlbums, reduxMyPlaylists]);

  const handleSelect = async (type) => {
    if (type === "album") {
      setCategory("album");
      dispatch(createNewPlaylistStart());
      const res = await playlistServices.createNewPlaylist(
        user.accessToken,
        initAlbum(myAlbums)
      );
      if (res && res.success) {
        dispatch(createNewPlaylistSuccess(res.data));
        const updatedAlbums = [...myAlbums, res.data];
        setMyAlbums(updatedAlbums);
        dispatch(fetchMyPlaylistsSuccess(myPlaylists));
        // toast.success("Tạo mới một album thành công");
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
        const updatedPlaylists = [...myPlaylists, res.data];
        setMyPlaylists(updatedPlaylists);

        // toast.success("Tạo mới một playlist thành công");

        dispatch(fetchMyPlaylistsSuccess(myPlaylists));
        return;
      } else {
        dispatch(createNewPlaylistFailure());
      }
    }
    // else (type === "song"){
    //   dispatch(createNewPlaylistStart());
    //   const res = await playlistServices.createNewPlaylist(
    //     user.accessToken,
    //     initAlbum()
    //   );
    //   if (res && res.success) {
    //     dispatch(createNewPlaylistSuccess(res.data));
    //     reduxMyPlaylists.push(res.data);
    //     dispatch(fetchMyPlaylistsSuccess(reduxMyPlaylists));
    //     return;
    //   } else {
    //     dispatch(createNewPlaylistFailure());
    //   }
    // }
    setIsOpenMenu((prev) => ({
      add: false,
      filter: false,
    }));
  };

  return (
    <div className="w-1/4 fixed left-2 mt-2 top-0 sidebar ">
      {/* >>>>>>> Home & Search  <<<<<<<<*/}
      <div className="nav secondary_bg rounded-lg py-6 px-5">
        <div className="flex items-center gap-4 text-secondaryText cursor-pointer hover:text-white transition-all ease-out duration-150">
          <BiSolidHome className="font-bold text-xl" />
          <span className="font-semibold">Trang chủ</span>
        </div>
        <div className="flex mt-4 items-center gap-4 text-secondaryText cursor-pointer hover:text-white transition-all ease-out duration-150">
          <FiSearch className="font-bold text-xl" />
          <span className="font-semibold">Tìm kiếm</span>
        </div>
      </div>

      {/* >>>>>>> Library  <<<<<<<<<< */}
      <div className="mt-2 secondary_bg rounded-lg pl-3 pr-1 py-2 h-[480px] ">
        <div className=" fixed md:w-[calc(24%)] z-40 bg-secondaryBg  ">
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
                  category={category}
                  setCategory={setCategory}
                  handleSelect={handleSelect}
                  buttonAddRef={buttonAddRef}
                  isOpen={isOpenMenu}
                  setIsOpen={setIsOpenMenu}
                  isOpenModal={isOpenModal}
                  setIsOpenModal={setIsOpenModal}
                />
              )}
            </button>
            <Tooltip content="Thêm mới album hoặc bài hát" />
          </div>

          <div className="flex gap-2 items-center mt-1 mb-1 px-2">
            {myAlbums?.length > 0 && (
              <div onClick={() => setCategory("album")}>
                <PillTag active={category === "album"} content={"Albums"} />
              </div>
            )}
            {myPlaylists?.length > 0 && (
              <div
                onClick={() => {
                  setCategory("playlist");
                }}
              >
                <PillTag
                  active={category === "playlist"}
                  content={"Playlists"}
                />
              </div>
            )}
            {mySongs?.length > 0 && (
              <PillTag active={category === "song"} content={"Bài hát"} />
            )}
          </div>
        </div>

        <LibraryListItem
          category={category}
          setCategory={setCategory}
          user={user}
          myAlbums={myAlbums}
          setMyAlbums={setMyAlbums}
          mySongs={mySongs}
          setMySongs={setMySongs}
          role={role}
          myPlaylists={myPlaylists}
          setMyPlaylists={setMyPlaylists}
          isOpenMenu={isOpenMenu}
          setIsOpenMenu={setIsOpenMenu}
          isOpenModal={isOpenModal}
          setIsOpenModal={setIsOpenModal}
        />
      </div>
      <div className="relative">
        {isOpenModal && (
          <Modal
            title={"Tạo mới một playlist"}
            cancelButton="Không phải bây giờ"
            okButton={"Đăng nhập "}
            // className="w-[200px] "
            isOpen={isOpenModal}
            onCancel={() => {
              setIsOpenModal(false);
            }}
            onOk={() => {
              router.push("/login");
              setIsOpenModal(false);
            }}
            children={"Hãy đăng nhập để tạo vào chia sẻ playlist của bạn"}
          ></Modal>
        )}
      </div>
      {/* <div className="">
        <ToastContainer draggablePercent={60} autoClose={5000} limit={2} />
      </div> */}
      {/* <Signup /> */}
    </div>
  );
};

export default Sidebar;
