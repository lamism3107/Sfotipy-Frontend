"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Header from "../../../components/Header/Header";
import GradientBG from "../../../components/GradientBG/GradientBG";
import { useDispatch, useSelector } from "react-redux";
import * as playlistServices from "../../../services/playlist.api.js";
import * as songServices from "../../../services/song.api.js";
import {
  editAlbumSuccess,
  setCurrentPlaylist,
} from "../../../redux/slice/playlist.slice";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import PlaylistMenuContext from "../../../components/MenuContext/PlaylistMenuContext";
import EditPlaylistModal from "../../../components/EditPlaylistModal/EditPlaylistModal";
import SearchList from "../../../components/SearchList/SearchList";
import { FaCheck, FaPause, FaPlay, FaPlus } from "react-icons/fa";
import { LuClock3 } from "react-icons/lu";
import Link from "next/link";
import CreateSongModal from "../../../components/CreateSongModal/CreateSongModal";
import {
  calculateTimeDifference,
  deleteFirebaseItem,
  uploadFile,
} from "../../../utils/helperFuncs";
import { editItemOfLibrary } from "../../../redux/slice/library.slice";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useMyAlbums, useMySongs } from "../../customHooks/librarySWRHooks.js";
import TableSongNotAdded from "../../../components/TableSongNotAdded/TableSongNotAdded.jsx";

const tableSongHoverClick = ["albumSongs", "notAddedSongs"];
export default function AlbumPage(props) {
  const { params } = props;
  const bodyRef = useRef();
  const dispatch = useDispatch();
  const reduxCurrentPlaylist = useSelector(
    (state) => state.playlist.currentPlaylist
  );
  const reduxCurrentUser = useSelector((state) => state.auth.login.currentUser);
  const swrMySOngs = useMySongs(reduxCurrentUser._id);

  const [isVisible, setIsVisible] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({});
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenCreateSongModal, setIsOpenCreateSongModal] = useState(false);
  const [isOpenPlaylistMenuContext, setIsOpenPlaylistMenuContext] =
    useState(false);
  const targetRef = useRef();
  const [searchValue, setSearchValue] = useState("");
  const [menuContextProps, setPlaylistMenuContextProps] = useState();
  const [songsNotAdded, setSongsNotAdded] = useState([]);
  const [songHovered, setSongHovered] = useState({
    type: "",
    songIndex: -1,
  });
  const [songClicked, setSongClicked] = useState({
    type: [],
    songIndex: -1,
  });
  const [choosePhoto, setChoosePhoto] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(null);
  const albumSongRef = useRef();
  // const [albumSongs, setAlbumSongs] = useState([]);

  const updateThumbnail = async () => {
    const updatedItem = {
      _id: reduxCurrentPlaylist?._id,
      name: reduxCurrentPlaylist?.name,
      description: reduxCurrentPlaylist?.description,
      thumbnail: imgUploaded,
    };
    const res = await playlistServices.editMyPlaylistAlbum(updatedItem);
    if (res && res.success) {
      dispatch(editAlbumSuccess(res.data));
      dispatch(editItemOfLibrary(res.data));
      dispatch(setCurrentPlaylist(res.data));
    }
  };

  // Get current playlist/album
  const swrCurrentPlaylist = useSWR(
    `/playlists/${params.slugs}`,
    () => playlistServices.getPlaylistById(params.slugs),
    {
      //Loại bỏ các request trùng lặp có cùng key trong khoảng 5s
      revalidateEvents: false,
      revalidateIfStale: false,
      onSuccess: (currentPlaylist) => {
        dispatch(setCurrentPlaylist(currentPlaylist.data));
      },
    }
  );

  // Get song not added to current playlist
  useEffect(() => {
    const getNotAddedSong = async () => {
      const notAddedSongs = [];
      const mySongs = await swrMySOngs.mutate();
      if (mySongs && reduxCurrentPlaylist) {
        mySongs?.forEach((song) => {
          if (!song.album) {
            notAddedSongs.push(song);
          } else {
            if (song.album !== reduxCurrentPlaylist?._id)
              notAddedSongs.push(song);
          }
        });
        setSongsNotAdded(notAddedSongs);
      }
    };
    getNotAddedSong();
  }, [reduxCurrentPlaylist]);
  //Handle scroll to hide header
  useEffect(() => {
    const handleScroll = () => {
      if (bodyRef?.current.scrollTop > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    bodyRef?.current?.addEventListener("scroll", handleScroll);
    return () => {
      bodyRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleClickOutsideAlbumSong = (event) => {
    if (albumSongRef.current && !albumSongRef.current.contains(event.target)) {
      setSongClicked((prev) => {
        let newType = [...prev.type];
        newType = newType.filter((t) => t !== tableSongHoverClick[0]);
        return {
          type: newType,
          songIndex: -1,
        };
      });
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideAlbumSong);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAlbumSong);
    };
  }, []);
  const handleContextMenu = (e, type, object) => {
    e.preventDefault();
    setIsOpenPlaylistMenuContext(!isOpenPlaylistMenuContext);

    setPlaylistMenuContextProps({
      event: "click",
      target: targetRef,
      object: object,
      type: type,
      top: e.pageY,
      left: e.pageX,
    });
  };

  const handleMouseEnter = useCallback(() => {
    setChoosePhoto(true);
  });
  const handleMouseLeave = useCallback(() => {
    setChoosePhoto(false);
  });

  useEffect(() => {
    if (imgUploaded !== null) updateThumbnail();
  }, [imgUploaded]);

  return (
    <div className="h-[calc(100vh-95px)] relative inset-0 rounded-t-lg">
      <Header
        isVisible={isVisible}
        bgColor={"bg-[#212121]"}
        title={
          <div className="h-8 flex gap-2 items-center ">
            <button
              data-modal-hide="default-modal"
              type="button"
              className=" rounded-full font-semibold hover:scale-105  bg-green-400  text-black px-3.5 py-3.5 "
            >
              <FaPlay className="text-black text-lg" />
            </button>
            <h2 className="text-2xl text-white font-bold">
              {reduxCurrentPlaylist?.name}
            </h2>
          </div>
        }
      />
      <div
        ref={bodyRef}
        style={{}}
        className="  h-[calc(100vh-95px)] relative z-0  containter bg-secondaryBg   rounded-lg overflow-y-auto  overflow-x-hidden   mr-2"
      >
        <GradientBG height={"md:h-[550px]"} from="from-[#565656]" />
        <div className="mt-[80px] relative z-50 w-full h-full  max-h-[calc(77vh-25px)] ">
          {/* Playlist Header  */}
          <div className="pr-4 h-fit flex  justify-start items-center">
            <div className="p-6 relative">
              <Image
                onMouseEnter={handleMouseEnter}
                src={
                  reduxCurrentPlaylist?.thumbnail
                    ? reduxCurrentPlaylist?.thumbnail
                    : "/assets/playlistDefault.png"
                }
                className={`shadow-[rgba(0,_0,_0,_0.8)_0px_30px_90px]  rounded-[4px] ${
                  choosePhoto && "brightness-60"
                }`}
                width={185}
                height={185}
                alt="thumbnail"
              />
              {choosePhoto && (
                <div
                  className="absolute inset-6"
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    width={180}
                    height={180}
                    src={"/assets/choosePhoto.png"}
                    alt="playlistImg"
                    className="absolute opacity-80  inset-0 object-cover w-full h-full  rounded-[4px]"
                  />
                  <label className="w-full h-full absolute z-20">
                    <input
                      type="file"
                      name="upload-file"
                      //Nếu isImage=true thì chấp nhận mọi file có có type là image. Ngược lại các file có type là audio
                      accept="image/*"
                      className="w-0 h-0 hidden absolute cursor-pointer z-20"
                      onInput={(e) => {
                        if (reduxCurrentPlaylist?.thumbnail) {
                          deleteFirebaseItem(reduxCurrentPlaylist?.thumbnail);
                        }
                        uploadFile(e, "albumImg", setImgUploaded);
                      }}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Text info  */}
            <div className="flex-1  flex flex-col justify-end  h-full w-full">
              <p className="text-white text-md mt-5 font-medium">
                {reduxCurrentPlaylist?.codeType}
              </p>
              <h1 className="text-white text-[84px] font-bold leading-[100px]">
                {reduxCurrentPlaylist?.name}
              </h1>
              <p className="text-white text-md font-semibold mt-5">
                {reduxCurrentPlaylist?.owner?.name}
              </p>
            </div>
          </div>

          {/* Playlist Body  */}
          <div className="w-full min-h-[294px] overflow-y-auto bg-darkOverlay px-5 pb-8 ">
            <div className="w-full h-fit flex gap-8 items-center  py-5 ">
              {reduxCurrentPlaylist?.songs?.length > 0 && (
                <button
                  data-modal-hide="default-modal"
                  type="button"
                  className=" rounded-full font-semibold hover:scale-105  bg-green-400  text-black px-5 py-5 "
                >
                  <FaPlay className="text-black text-xl" />
                </button>
              )}
              <button
                ref={targetRef}
                className="h-14 three-dot outline-none text-secondaryText hover:text-white"
                onClick={(e) =>
                  handleContextMenu(e, "Album", reduxCurrentPlaylist)
                }
              >
                <BsThreeDots className="text-3xl " />
              </button>
            </div>
            {reduxCurrentPlaylist?.songs?.length > 0 ? (
              <div className="relative overflow-x-auto shadow-md w-full text-sm  ">
                {/* Table header */}
                <div className="text-md basis-56 flex items-center w-full text-secondaryText bg-transparent border-b border-[#575757]">
                  <span className="text-md text-center px-5 py-3">#</span>
                  <span className="w-4/12 pr-3 py-3 text-left">Tên</span>
                  <span className="w-3/12 pr-3 py-3 text-left">Album</span>
                  <span className="w-3/12 pr-3 py-3 text-left flex items-center ">
                    Thời gian thêm
                  </span>
                  <span className=" text-center w-[130px]">
                    <LuClock3 className="text-xl mx-auto" />
                  </span>
                </div>

                {/* Table body  */}
                <div className="mt-3.5">
                  {reduxCurrentPlaylist?.songs.map((item, index) => {
                    return (
                      <div
                        ref={albumSongRef}
                        className={`${
                          songClicked.type.includes(tableSongHoverClick[0]) &&
                          songClicked.songIndex === index
                            ? "bg-[#5e5e5f] text-white"
                            : "hover:bg-[#393939] hover:text-white text-secondaryText bg-transparent"
                        } flex h-14 items-center w-full rounded-[4px] overflow-x-auto text-[14px]   `}
                        onClick={() => {
                          setSongClicked((prev) => {
                            let newType = [...prev.type];
                            if (!prev.type.includes(tableSongHoverClick[0])) {
                              newType = [...prev.type, tableSongHoverClick[0]];
                            }
                            return {
                              type: newType,
                              songIndex: index,
                            };
                          });
                          setSongHovered((prev) => {
                            let newType = [...prev.type];
                            newType = newType.filter(
                              (t) => t !== tableSongHoverClick[0]
                            );
                            return {
                              type: newType,
                              songIndex: -1,
                            };
                          });
                        }}
                        onMouseEnter={() => {
                          if (
                            songClicked.type === tableSongHoverClick[0] &&
                            songClicked.index === item.index
                          ) {
                            return;
                          } else {
                            setSongHovered({
                              type: tableSongHoverClick[0],
                              songIndex: index,
                            });
                          }
                        }}
                        onMouseLeave={() =>
                          setSongHovered({
                            type: "",
                            songIndex: -1,
                          })
                        }
                      >
                        {songHovered.type === tableSongHoverClick[0] &&
                        songHovered.songIndex === index ? (
                          <div>
                            <button className="px-5 py-3 w-[46px]">
                              <FaPlay className="text-white text-sm" />
                            </button>
                          </div>
                        ) : (
                          <>
                            {songClicked.type.includes(
                              tableSongHoverClick[0]
                            ) ? (
                              songClicked.songIndex === index && (
                                <div>
                                  <button className="px-5 py-3 w-[46px]">
                                    <FaPlay className="text-white text-sm" />
                                  </button>
                                </div>
                              )
                            ) : (
                              <div className="text-md text-center w-[46px] px-5 py-3">
                                <span>{index + 1}</span>
                              </div>
                            )}
                          </>
                        )}

                        <div className="w-4/12 pr-3  text-left">
                          <div className="cursor-pointer  rounded-[4px]  gap-3.5 flex item-center justify-start ">
                            <div className="w-[40px] h-[40px]">
                              <Image
                                width={50}
                                height={50}
                                alt="songImage"
                                className="object-cover  h-full rounded-[4px]"
                                src={
                                  item.songId.thumbnail === ""
                                    ? "https://firebasestorage.googleapis.com/v0/b/spotify-clone-350f3.appspot.com/o/playlistDefault.png?alt=media&token=99a06d44-2dee-412e-b659-695b591af95c"
                                    : item.songId.thumbnail
                                }
                              />
                            </div>
                            <div className="flex-1 flex items-center pr-3  text-left">
                              <Link
                                href={`/song/${item._id}`}
                                className="text-white hover:underline"
                              >
                                {" "}
                                {item.songId.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className=" w-3/12 pr-3 text-left">
                          {reduxCurrentPlaylist.name}
                        </div>
                        <div className=" w-3/12 pr-3 text-left">
                          {calculateTimeDifference(item.addDate)}
                        </div>
                        <div className="flex relative items-center justify-center gap-2 text-center w-[130px]">
                          {/* {songHovered && (
                              <button className="absolute bg-green-400 left-4 p-1 rounded-full">
                                <FaCheck className="text-black text-[10px]" />
                              </button>
                            )} */}
                          3:04
                          {songHovered.type === tableSongHoverClick[0] &&
                            songHovered.songIndex === index && (
                              <button
                                ref={targetRef}
                                className="h-14 absolute right-5 three-dot outline-none text-secondaryText hover:text-white"
                                onClick={(e) =>
                                  handleContextMenu(e, "Song", item)
                                }
                              >
                                <BsThreeDots className="text-xl " />
                              </button>
                            )}
                          {songClicked.type.includes(tableSongHoverClick[0]) &&
                            songClicked.songIndex === index && (
                              <button
                                ref={targetRef}
                                className="h-14 absolute right-5 three-dot outline-none text-secondaryText hover:text-white"
                                onClick={(e) =>
                                  handleContextMenu(e, "Song", item)
                                }
                              >
                                <BsThreeDots className="text-xl " />
                              </button>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xl font-bold text-white pb-8 border-b-[1px]">
                {reduxCurrentPlaylist?.name} hiện chưa có bài hát nào. Hãy thêm
                vào bài hát của bạn!
              </p>
            )}

            {/* Song to add */}
            <div className="w-full mt-6 min-h-14 py-2  border-gray-600">
              {/* Recommend Songs  */}
              <div className="mt-8 text-xl font-bold text-white">
                <h3 className="mb-3">Danh sách bài hát của bạn</h3>
                {songsNotAdded.length > 0 ? (
                  <div className="flex flex-col">
                    <div className="flex justify-start gap-2 items-center">
                      <SearchList
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                      />
                      <button
                        data-modal-hide="default-modal"
                        type="button"
                        className=" rounded-full font-semibold hover:scale-105 flex items-center justify-center gap-2 bg-green-400 ms-3  text-md text-black px-5 py-2 text-center no-wrap"
                        onClick={() => setIsOpenCreateSongModal(true)}
                      >
                        <FaPlus className=" text-[md]  font-light" />
                        <p className="w-fit">Tạo mới bài hát</p>
                      </button>
                    </div>
                    {/* List song not added  */}
                    {/* SongNotAdded Table */}
                    <TableSongNotAdded
                      songsNotAdded={songsNotAdded}
                      setSongHovered={setSongHovered}
                      setSongClicked={setSongClicked}
                      songClicked={songClicked}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 ">
                    <p className="text-md font-normal text-secondaryText">
                      Bạn hiện chưa tạo bài hát nào. Tạo bài hát mới tại đây
                    </p>
                    <button
                      data-modal-hide="default-modal"
                      type="button"
                      className=" rounded-full font-semibold hover:scale-105 flex items-center justify-center gap-2 bg-green-400 ms-3  text-md text-black px-5 py-2 text-center no-wrap"
                      onClick={() => setIsOpenCreateSongModal(true)}
                    >
                      <FaPlus className=" text-[md]  font-light" />
                      <p className="w-fit">Tạo mới bài hát</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenPlaylistMenuContext && (
        <PlaylistMenuContext
          isOpenConfirmModal={isOpenConfirmModal}
          setIsOpenConfirmModal={setIsOpenConfirmModal}
          isOpenEditModal={isOpenEditModal}
          setIsOpenEditModal={setIsOpenEditModal}
          setIsOpenPlaylistMenuContext={setIsOpenPlaylistMenuContext}
          menuContextProps={menuContextProps}
        />
      )}
      {isOpenEditModal && (
        <EditPlaylistModal
          isOpen={isOpenEditModal}
          setIsOpen={setIsOpenEditModal}
        />
      )}
      {isOpenCreateSongModal && (
        <CreateSongModal
          isOpen={isOpenCreateSongModal}
          setIsOpen={setIsOpenCreateSongModal}
          album={reduxCurrentPlaylist}
        />
      )}
      {isOpenConfirmModal && (
        <ConfirmModal
          setIsOpen={setIsOpenConfirmModal}
          isOpen={isOpenConfirmModal}
          title={confirmModalProps.title}
          cancelButton={confirmModalProps.cancelButton}
          okButton={confirmModalProps.okButton}
          onOk={confirmModalProps.onOk}
          children={confirmModalProps.children}
        />
      )}
    </div>
  );
}
