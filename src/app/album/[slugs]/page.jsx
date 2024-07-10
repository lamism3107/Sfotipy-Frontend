"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header/Header";
import GradientBG from "../../../components/GradientBG/GradientBG";
import { useDispatch, useSelector } from "react-redux";
import * as playlistServices from "../../../services/playlistServices";
import * as songServices from "../../../services/songServices";
import { setCurrentPlaylist } from "../../../redux/slice/playlist.slice";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { openPlaylistMenuContext } from "../../../redux/slice/system.slice";
import PlaylistMenuContext from "../../../components/MenuContext/PlaylistMenuContext";
import EditPlaylistModal from "../../../components/EditPlaylistModal/EditPlaylistModal";
import SearchGlobal from "../../../components/SearchList/SearchList";
import SearchList from "../../../components/SearchList/SearchList";
import { FaCheck, FaPlay, FaPlus } from "react-icons/fa";
import { LuClock3 } from "react-icons/lu";
import Link from "next/link";
export default function AlbumPage(props) {
  const { params } = props;
  const bodyRef = useRef();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const reduxCurrentPlaylist = useSelector(
    (state) => state.playlist.currentPlaylist
  );
  const [isOpenPlaylistMenuContext, setIsOpenPlaylistMenuContext] =
    useState(false);
  const reduxMySongs = useSelector((state) => state.song.mySongs.mySongs);
  const targetRef = useRef();
  const [searchValue, setSearchValue] = useState("");
  const [menuContextProps, setPlaylistMenuContextProps] = useState();
  const [songsNotAdded, setSongsNotAdded] = useState([]);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  // const [albumSongs, setAlbumSongs] = useState([]);

  useEffect(() => {
    const getCurrentPlaylist = async () => {
      const res = await playlistServices.getPlaylistById(params.slugs);
      if (res && res.success) {
        dispatch(setCurrentPlaylist(res.data));
      }
    };

    getCurrentPlaylist();
  }, []);

  useEffect(() => {
    const notAddedSongs = [];
    reduxMySongs.forEach((song) => {
      if (!song.album) {
        notAddedSongs.push(song);
      } else {
        if (song.album !== reduxCurrentPlaylist._id) notAddedSongs.push(song);
      }
    });
    setSongsNotAdded(notAddedSongs);
  }, [reduxMySongs]);
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
  // console.log("check reduxMySongs", reduxMySongs);
  // console.log("check songNotAdd", songsNotAdded);
  // console.log("check albumId", reduxCurrentPlaylist?._id);
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
            <div className="p-6 ">
              <Image
                src={
                  reduxCurrentPlaylist?.thumbnail !== ""
                    ? reduxCurrentPlaylist?.thumbnail
                    : "/assets/playlistDefault.png"
                }
                className="shadow-[rgba(0,_0,_0,_0.8)_0px_30px_90px] rounded-[4px]"
                width={185}
                height={185}
                alt="thumbnail"
              />
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
          <div className="w-full min-h-[294px] overflow-y-auto bg-darkOverlay px-5 ">
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
            {
              reduxCurrentPlaylist?.songs.length > 0 ? (
                <div className="relative overflow-x-auto shadow-md w-full text-sm  ">
                  {/* Table header */}
                  <div className="text-md basis-56 flex items-center w-full text-secondaryText bg-transparent border-b border-[#575757]">
                    <span className="text-md text-center px-5 py-3">#</span>
                    <span className="w-4/12 pr-3 py-3 text-left">Tên</span>
                    <span className="w-3/12 pr-3 py-3 text-left">Album</span>
                    <span className="w-3/12 pr-3 py-3 text-left flex items-center ">
                      Ngày thêm
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
                          className=" flex items-center w-full rounded-[4px] overflow-x-auto text-[14px]  hover:bg-[#393939] hover:text-white text-secondaryText bg-transparent hover: border-[#575757]"
                          onMouseEnter={() => setIsMouseEnter(true)}
                          onMouseLeave={() => setIsMouseEnter(false)}
                        >
                          {isMouseEnter ? (
                            <button className="px-3 py-3 w-[46px]">
                              <FaPlay className="text-white text-md" />
                            </button>
                          ) : (
                            <div className="text-md text-center w-[46px] px-5 py-3">
                              <span>{index + 1}</span>
                            </div>
                          )}
                          <div className="w-4/12 pr-3 py-2 text-left">
                            <div className="cursor-pointer  rounded-md  gap-3.5 flex item-center justify-start ">
                              <div className="w-[44px] h-[44px]">
                                <Image
                                  width={50}
                                  height={50}
                                  alt="song image"
                                  className="object-cover  h-full rounded-md"
                                  src={
                                    // item.thumbnail === ""
                                    "https://firebasestorage.googleapis.com/v0/b/spotify-clone-350f3.appspot.com/o/playlistDefault.png?alt=media&token=99a06d44-2dee-412e-b659-695b591af95c"
                                    // : item.thumbnail
                                  }
                                />
                              </div>
                              <div className="flex-1 pr-3 py-3 text-left">
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
                          <div className=" w-3/12 pr-3 py-3 text-left">
                            {reduxCurrentPlaylist.name}
                          </div>
                          <div className=" w-3/12 pr-3 py-3 text-left">
                            {item.addDate}
                          </div>
                          <div className="flex relative items-center justify-center gap-2 text-center w-[130px]">
                            {/* {isMouseEnter && (
                              <button className="absolute bg-green-400 left-4 p-1 rounded-full">
                                <FaCheck className="text-black text-[10px]" />
                              </button>
                            )} */}
                            3:04
                            {isMouseEnter && (
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
                // <TableContent />
                <p className="text-xl font-bold text-white pb-8 border-b-[1px]">
                  {reduxCurrentPlaylist?.name} hiện chưa có bài hát nào. Hãy
                  thêm vào bài hát của bạn!
                </p>
              )
              // <TableContent />
            }

            <div className="w-full mt-6 min-h-14 py-2  border-gray-600">
              {/* Recommend Songs  */}
              <div className="mt-8 text-xl font-bold text-white">
                <h3 className="mb-3">Danh sách bài hát của bạn</h3>

                {songsNotAdded.length > 0 ? (
                  <div className="flex justify-start gap-2 items-center">
                    <SearchList
                      searchValue={searchValue}
                      setSearchValue={setSearchValue}
                    />
                    <button
                      data-modal-hide="default-modal"
                      type="button"
                      className=" rounded-full font-semibold hover:scale-105 flex items-center justify-center gap-2 bg-green-400 ms-3  text-md text-black px-5 py-2 text-center no-wrap"
                    >
                      <FaPlus className=" text-[md]  font-light" />
                      <p className="w-fit">Tạo mới bài hát</p>
                    </button>
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
    </div>
  );
}
