"use client";

import React, { useEffect, useRef, useState } from "react";
import FilterMenu from "../FilterMenu/FilterMenu";
import { FiMenu } from "react-icons/fi";
import { LuDot } from "react-icons/lu";
import SearchLibrary from "../SearchLibrary/SearchLibrary";
import { formatDate } from "../../utils/helperFuncs";
import * as playlistServices from "../../services/playlistServices";
import * as libraryServices from "../../services/libraryServices";
import {
  createNewAlbumSuccess,
  createNewPlaylistStart,
  createNewPlaylistSuccess,
  fetchMyAlbumsSuccess,
  fetchMyPlaylistsSuccess,
  setCurrentPlaylist,
} from "../../redux/slice/playlist.slice";
import {
  artistOptions,
  initAlbum,
  initPlaylist,
  userOptions,
} from "../../constants/initValue";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelConfirmModal,
  openConfirmModal,
} from "../../redux/slice/system.slice";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  addItemToLibrary,
  fetchLibraryDataSuccess,
} from "../../redux/slice/library.slice";
import PlaylistMenuContext from "../MenuContext/PlaylistMenuContext";
import EditPlaylistModal from "../EditPlaylistModal/EditPlaylistModal";
import Link from "next/link";
import Image from "next/image";

function LibraryListItem({
  // libraryData,
  myAlbums,
  myPlaylists,
  user,
  isOpenMenu,
  setIsOpenMenu,
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [filterOpt, setFilterOpt] = useState({
    title: "Thêm gần đây",
    query: "-createdAt",
  });
  const buttonFilterRef = useRef(null);
  const pathname = usePathname();
  const [isOpenPlaylistMenuContext, setIsOpenPlaylistMenuContext] =
    useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [menuContextProps, setPlaylistMenuContextProps] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isFoundSearchData, setIsFoundSearchData] = useState(true);
  const nameRef = useRef();
  const libraryData = useSelector((state) => state.library.libraryData);
  const reduxCategoryList = useSelector(
    (state) => state.library.category.categoryList
  );
  const reduxCurrentCategory = useSelector(
    (state) => state.library.category.currentCategory
  );

  const showSearchAndFilter = () => {
    if (libraryData?.libraryData?.length > 0) {
      return (
        <div className="flex  items-center justify-between pr-2  z-10  mb-3 ">
          <SearchLibrary
            filterOpt={filterOpt}
            setIsFoundSearchData={setIsFoundSearchData}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
          <button
            ref={buttonFilterRef}
            className="cursor-pointer relative  z-1 outline-none [&_p]:hover:text-white  [&_svg]:hover:text-white transition-all ease-out duration-200  bg-transparent  flex gap-1.5 items-center"
            onClick={() => {
              console.log("ditconme");
              setIsOpenMenu((prev) => ({
                add: false,
                filter: !prev.filter,
              }));
            }}
          >
            <p className="text-sm font-semibold text-secondaryText ">
              {filterOpt.title}
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
    if (libraryData?.libraryData.length > 0) {
      const isActived = pathname.substring(pathname.lastIndexOf("/") + 1);
      return (
        <div className="flex flex-col  mt-3">
          {searchValue !== "" && !isFoundSearchData && (
            <div className="min-h-[300px] flex flex-col items-center justify-center">
              <p className="font-bold mb-3">
                Không thể tìm thấy "{searchValue}"
              </p>
              <p className="text-sm">Hãy thử tìm kiếm bằng từ khoá khác</p>
            </div>
          )}
          {isFoundSearchData && searchValue === "" && (
            <>
              {libraryData?.libraryData.map((item, id) => {
                const length = libraryData?.libraryData.length;
                return (
                  <Link
                    href={`/${item.codeType.toLowerCase()}/${item._id}`}
                    onClick={() => {
                      if (
                        item.codeType === "Playlist" ||
                        item.codeType === "Album"
                      ) {
                        dispatch(setCurrentPlaylist(item));
                      }
                    }}
                    key={id}
                    className={`${
                      item._id === isActived &&
                      "bg-tertiaryBg  hover:bg-[#393939]"
                    } flex gap-2 w-full  justify-between hover rounded-md hover:bg-[#1a1a1a]  ${
                      id === length - 1 && "mb-3"
                    }`}
                    onContextMenu={(e) =>
                      handleContextMenu(e, item.codeType, item)
                    }
                  >
                    <div className="cursor-pointer flex-grow w-5/7 rounded-md py-1.5 px-2 gap-3.5 flex item-center justify-start ">
                      <div className="w-[50px] h-[50px]">
                        <Image
                          width={200}
                          height={200}
                          className="object-cover  h-full rounded-md"
                          src={
                            item.thumbnail === ""
                              ? "https://firebasestorage.googleapis.com/v0/b/spotify-clone-350f3.appspot.com/o/playlistDefault.png?alt=media&token=99a06d44-2dee-412e-b659-695b591af95c"
                              : item.thumbnail
                          }
                        />
                      </div>
                      <div className="flex flex-col  my-1 flex-1">
                        <p className="text-white "> {item.name}</p>
                        <div className="flex items-center  ">
                          {reduxCurrentCategory === "All" && (
                            <div className="text-sm flex items-center text-secondaryText leading-4">
                              {item.codeType}
                              <span className="text-md px-1">-</span>
                            </div>
                          )}

                          <p className="text-sm text-secondaryText ">
                            {item?.owner?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
          {isFoundSearchData && searchValue !== "" && (
            <>
              {libraryData?.libraryData.map((item, id) => {
                const length = libraryData?.libraryData.length;
                const regex = new RegExp(searchValue, "gi");
                let replaceString = item.name.replace(
                  regex,
                  `<mark style="background-color:#2e77d0; color: #fff; border-radius:4px; padding: 0 1px;">${searchValue}</mark>`
                );
                return (
                  <Link
                    href={`/${item.codeType.toLowerCase()}/${item._id}`}
                    onClick={() => {
                      if (
                        item.codeType === "Playlist" ||
                        item.codeType === "Album"
                      ) {
                        dispatch(setCurrentPlaylist(item));
                      }
                    }}
                    key={id}
                    className={`${
                      item._id === isActived &&
                      "bg-tertiaryBg  hover:bg-[#393939]"
                    } flex gap-2 w-full  justify-between hover rounded-md hover:bg-[#1a1a1a]  ${
                      id === length - 1 && "mb-3"
                    }`}
                    onContextMenu={(e) =>
                      handleContextMenu(e, item.codeType, item)
                    }
                  >
                    <div className="cursor-pointer flex-grow w-5/7 rounded-md py-1.5 px-2 gap-3.5 flex item-center justify-start ">
                      <div className="w-[50px] h-[50px]">
                        <Image
                          width={200}
                          height={200}
                          className="object-cover  h-full rounded-md"
                          src={
                            item.thumbnail === ""
                              ? "https://firebasestorage.googleapis.com/v0/b/spotify-clone-350f3.appspot.com/o/playlistDefault.png?alt=media&token=99a06d44-2dee-412e-b659-695b591af95c"
                              : item.thumbnail
                          }
                        />
                      </div>
                      <div className="flex flex-col  my-1 flex-1">
                        <p
                          dangerouslySetInnerHTML={{ __html: replaceString }}
                          className="text-white "
                        >
                          {/* {() => setReplaceName()} */}
                          {/* {replaceString} */}
                        </p>
                        <div className="flex items-center  ">
                          {reduxCurrentCategory === "All" && (
                            <div className="text-sm flex items-center text-secondaryText leading-4">
                              {item.codeType}
                              <span className="text-md px-1">-</span>
                            </div>
                          )}

                          <p className="text-sm text-secondaryText ">
                            {item?.owner?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </div>
      );
    } else {
      if (user.role === "artist") {
        return (
          <div className="flex flex-col gap-2 ">
            {artistOptions.map((item, id) => (
              <div
                key={id}
                className={`${
                  id === 2 && "mb-5"
                } tertiary_bg rounded-lg py-5 px-4 `}
              >
                <p className="leading-7 mb-1 font-bold text-md ">
                  {item.title}
                </p>
                <p className=" text-sm text-semibold">{item.desc}</p>
                <button
                  className="cursor-pointer rounded-full text-black mt-4 px-3 py-1.5 bg-white font-semibold text-sm hover:scale-105 transiton-all ease-out duration-150"
                  onClick={() => {
                    handleClickButtonAdd(item.type);
                  }}
                >
                  {item.button}
                </button>
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <>
            {userOptions.map((item, id) => (
              <div key={id} className="   tertiary_bg rounded-lg py-5 px-4 ">
                <p className="font-bold text-md leading-7 mb-1">{item.title}</p>
                <p className=" text-sm text-semibold">{item.desc}</p>
                <button
                  className="rounded-full text-black mt-4 px-3 py-1.5 bg-white font-semibold text-sm hover:scale-105 transiton-all ease-out duration-150"
                  onClick={() => handleClickButtonAdd(item.type)}
                >
                  {item.button}
                </button>
              </div>
            ))}
          </>
        );
      }
    }
  };

  const handleClickButtonAdd = (type) => {
    const addItemToLibraryDB = async () => {
      if (type === "Album") {
        dispatch(createNewPlaylistStart());
        const res = await playlistServices.createNewPlaylist(
          initAlbum(myAlbums)
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
          initPlaylist(myPlaylists)
        );
        if (res && res.success) {
          dispatch(addItemToLibrary(res.data));
          dispatch(createNewPlaylistSuccess(res.data));
          dispatch(setCurrentPlaylist(res.data));

          const res2 = await libraryServices.addAlbumPlaylistToLibrary(
            res.data._id
          );
          if (res2 && res2.success) {
            router.push(`/playlist/${res.data._id}`);
            toast.success("Tạo mới playlist thành công!");
            return;
          }
        } else {
          toast.error("Tạo mới playlist thất bại");
        }
      }
    };
    addItemToLibraryDB();
  };

  //Handle ContextMenu
  const handleContextMenu = (e, type, object) => {
    e.preventDefault();
    setIsOpenPlaylistMenuContext(true);
    setPlaylistMenuContextProps({
      event: "contextMenu",
      target: null,
      object: object,
      type: type,
      top: e.pageY,
      left: e.pageX,
    });
  };
  const containerCss = () => {
    if (user) {
      if (libraryData.libraryData?.length > 0) {
        return "mt-[16px]  h-[368px]";
      } else {
        return " h-[408px]";
      }
    } else {
      return "";
    }
  };

  return (
    <div className="">
      <div
        className={`relative z-1 your_library 
      ${containerCss()}  
      overflow-y-scroll`}
      >
        {user ? (
          <>
            {showSearchAndFilter()}
            <>{showListItem()}</>
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
              onClick={() => {
                dispatch(
                  openConfirmModal({
                    title: "Tạo mới một playlist",
                    cancelButton: "Không phải bây giờ",
                    okButton: "Đăng nhập ",

                    onOk: () => {
                      router.push("/login");
                      dispatch(cancelConfirmModal());
                    },
                    children:
                      "Hãy đăng nhập để tạo vào chia sẻ playlist của bạn",
                  })
                );
              }}
              className="rounded-full text-black mt-4 px-3 py-1.5 bg-white font-semibold text-sm hover:scale-105 transiton-all ease-out duration-150"
            >
              Tạo danh sách phát
            </button>
          </div>
        )}
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

export default LibraryListItem;
