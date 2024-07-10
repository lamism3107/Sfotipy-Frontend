"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as playlistServices from "../../services/playlistServices";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { SlPicture } from "react-icons/sl";
import { TbTrashX } from "react-icons/tb";
import { deleteFirebaseItem, uploadFile } from "../../utils/helperFuncs";
import {
  editAlbumCancel,
  editAlbumSuccess,
  editPlaylistCancel,
  editPlaylistSuccess,
} from "../../redux/slice/playlist.slice";
import { RiErrorWarningLine } from "react-icons/ri";
import { editItemOfLibrary } from "../../redux/slice/library.slice";
import Image from "next/image";

function EditPlaylistModal({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const menuBarRef = useRef(null);
  const closeMenuBtn = useRef(null);
  const imgInputRef = useRef(null);
  const reduxEditingPlaylist = useSelector(
    (state) => state.playlist.editPlaylist.editingPlaylist
  );
  const reduxEditingAlbum = useSelector(
    (state) => state.playlist.editPlaylist.editingAlbum
  );
  const [imgUploaded, setImgUploaded] = useState(null);
  const [uploadStatusImg, setUploadStatusImg] = useState({ imgUploaded });
  const [item, setItem] = useState(null);
  const [menuBar, setMenuBar] = useState(false);
  const [noti, setNoti] = useState({
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  });

  const handleClickOutsideMenu = (event) => {
    if (
      menuBarRef.current &&
      !menuBarRef.current.contains(event.target) &&
      !closeMenuBtn.current.contains(event.target)
    ) {
      console.log("closeMenuBtn", closeMenuBtn.current);

      setMenuBar(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);
  useEffect(() => {
    if (reduxEditingAlbum) {
      setFormData({
        name: reduxEditingAlbum.name,
        description: reduxEditingAlbum.description,
      });
      setImgUploaded(reduxEditingAlbum.thumbnail);
      setItem(reduxEditingAlbum);
    }
    if (reduxEditingPlaylist) {
      setFormData({
        name: reduxEditingPlaylist.name,
        description: reduxEditingPlaylist.description,
      });
      setImgUploaded(reduxEditingPlaylist.thumbnail);
      setItem(reduxEditingPlaylist);
    }
  }, [reduxEditingAlbum, reduxEditingPlaylist]);

  const handleChangeForm = (e, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  const handleCloseModal = () => {
    if (
      item.name !== formData.name ||
      item.description !== formData.description ||
      item.thumbnail !== imgUploaded
    ) {
      if (noti.message === "") {
        setNoti({
          message: `Nhấn nút "Lưu" để lưu thông tin bạn đã thay đổi`,
          type: "info",
        });
      } else {
        if (item.codeType === "Playlist") {
          dispatch(editPlaylistCancel());
        }
        if (item.codeType === "Album") {
          dispatch(editAlbumCancel());
        }
        setFormData({ name: "", description: "" });
        setImgUploaded(null);
        setNoti({
          message: "",
          type: "",
        });
        setIsOpen(false);
      }
    } else {
      if (item.codeType === "Playlist") {
        dispatch(editPlaylistCancel());
      }
      if (item.codeType === "Album") {
        dispatch(editAlbumCancel());
      }
      setFormData({ name: "", description: "" });
      setNoti({
        message: "",
        type: "",
      });
      setImgUploaded(null);
      setIsOpen(false);
    }
  };
  const handleSubmit = async () => {
    const updatedItem = {
      _id: item._id,
      name: formData.name,
      description: formData.description,
      thumbnail: imgUploaded,
    };
    const res = await playlistServices.editMyPlaylistAlbum(updatedItem);
    if (res && res.success) {
      if (item.codeType === "Playlist") {
        dispatch(editPlaylistSuccess(res.data));
      }
      if (item.codeType === "Album") {
        dispatch(editAlbumSuccess(res.data));
      }
      dispatch(editItemOfLibrary(res.data));
      setFormData({ name: "", description: "" });
      setImgUploaded(null);
      setNoti({
        message: "",
        type: "",
      });
      toast.success(`Chỉnh sửa ${item.codeType} thành công!`);
      setIsOpen(false);
    }
  };

  console.log("check img", imgUploaded);
  console.log("check object", reduxEditingAlbum);
  return (
    <>
      (
      <div className=" bg-darkOverlay overflow-y-hidden overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0  max-h-full">
        <div
          className={` absolute left-[50%] translate-x-[-50%] top-[50%] w-2/3 lg:w-1/3 overflow-y-hidden translate-y-[-50%]  max-h-full 
            } `}
        >
          <div className="relative bg-[#282828] shadow py-6 pr-6 pl-5 rounded-lg">
            <div className="flex items-center justify-between   rounded-t ">
              <h3 className="text-2xl font-semibold text-white  text-center">
                Chỉnh sửa chi tiết
              </h3>
              <button
                onClick={() => handleCloseModal()}
                type="button"
                className="-mr-2 -mt-2 text-gray-400 bg-bt hover:bg-[#3e3e3e] rounded-full  w-8 h-8 ms-auto inline-flex justify-center items-center text-xl"
              >
                <IoClose className="text-lg" />
              </button>
            </div>

            {/* Body  */}
            <div className="mt-4 mb-6 pt-2 h-full">
              {/* Notification  */}
              {noti.message !== "" && (
                <div
                  className={` ${
                    noti.type === "info" ? "bg-blue-500" : "bg-red-500"
                  } flex items-center p-1.5 gap-2 mb-3 text-sm text-white rounded-md`}
                >
                  <RiErrorWarningLine className="text-lg" />
                  <span>{noti.message}</span>
                </div>
              )}

              {/* Update Form  */}
              <div className={` flex gap-2   overflow-y-auto text-black`}>
                {/* Img Area  */}
                <div
                  // style={{ boxShadow: "0 4px 4px rgba(0,0,0,.3)" }}
                  className="w-2/5 relative z-20 -ml-1 p-2"
                >
                  {imgUploaded ? (
                    <div className="flex  flex-col relative z-20  items-center rounded-md justify-center h-full shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                      <Image
                        width={90}
                        height={90}
                        src={imgUploaded}
                        alt="playlistImg"
                        className="object-cover w-full h-full rounded-md"
                      />
                      <button
                        ref={closeMenuBtn}
                        className={`absolute z-20 top-2 right-2 p-2 rounded-full ${
                          imgUploaded
                            ? " hover:block text-white bg-darkOverlay"
                            : "bg-[#202020] text-white hover:bg-white hover:text-black"
                        }   cursor-pointer outline-none border-none hover:shadow-me duration-200 transition-all ease-in-out`}
                        onClick={() => {
                          setMenuBar(!menuBar);
                        }}
                      >
                        <BsThreeDots className="text-md" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative cursor-pointer w-full ">
                      <label className="w-full h-full cursor-pointer ">
                        <div className="flex flex-col items-center rounded-md justify-center h-full shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                          <div
                            className="flex flex-col justify-center w-full h-full items-center rounded-md "
                            onMouseEnter={() => {
                              setUploadStatusImg(
                                "https://firebasestorage.googleapis.com/v0/b/spotify-clone-350f3.appspot.com/o/choosePhoto.png?alt=media&token=a99d11d7-78a9-4731-b3fb-25a5651836b3"
                              );
                            }}
                            onMouseLeave={() => {
                              setUploadStatusImg(
                                "https://firebasestorage.googleapis.com/v0/b/spotify-clone-350f3.appspot.com/o/playlistDefault.png?alt=media&token=6cc2ab67-36e8-40cc-8ed7-0998d8b31a55"
                              );
                            }}
                          >
                            <Image
                              width={230}
                              height={230}
                              className="object-cover rounded-md w-full h-full"
                              src={uploadStatusImg}
                              alt=""
                            />
                          </div>
                        </div>
                        <input
                          ref={imgInputRef}
                          type="file"
                          name="upload-file"
                          id={"imgInputRef"}
                          //Nếu isImage=true thì chấp nhận mọi file có có type là image. Ngược lại các file có type là audio
                          accept="image/*"
                          className="w-0 h-0 hidden absolute z-20 cursor-pointer"
                          onChange={(e) => {
                            let fileCategory = "";
                            if (item.codeType === "Playlist")
                              fileCategory = "playlistImg";
                            if (item.codeType === "Album")
                              fileCategory = "albumImg";
                            uploadFile(e, fileCategory, setImgUploaded);
                          }}
                        />
                        <button
                          ref={closeMenuBtn}
                          className="absolute top-2 right-2  p-2 rounded-full bg-[#202020] text-white hover:bg-white hover:text-black cursor-pointer outline-none border-none hover:shadow-me duration-200 transition-all ease-in-out"
                          onClick={() => {
                            setMenuBar(!menuBar);
                          }}
                        >
                          <BsThreeDots className="text-md" />
                        </button>
                      </label>
                    </div>
                  )}
                  {menuBar && (
                    <ul
                      className="absolute top-[59px] -right-[calc(100%-84px)] rounded-md bg-[#282828] shadow-[0px_4px_16px_rgba(0,0,0,0.1),_0px_8px_24px_rgba(0,0,0,0.1),_0px_16px_56px_rgba(0,0,0,0.1)]  z-40"
                      ref={menuBarRef}
                    >
                      <li className="p-2 hover:bg-[#3e3e3e] relative rounded-t-md flex items-center gap-2 z-20 text-white">
                        <label className="w-full h-full absolute z-20">
                          <input
                            ref={imgInputRef}
                            type="file"
                            name="upload-file"
                            id={"imgInputRef"}
                            //Nếu isImage=true thì chấp nhận mọi file có có type là image. Ngược lại các file có type là audio
                            accept="image/*"
                            className="w-0 h-0 hidden absolute cursor-pointer z-20"
                            onChange={(e) => {
                              let fileCategory = "";
                              if (item.codeType === "Playlist")
                                fileCategory = "playlistImg";
                              if (item.codeType === "Album")
                                fileCategory = "albumImg";
                              uploadFile(e, fileCategory, setImgUploaded);
                              setMenuBar(false);
                            }}
                          />
                        </label>

                        <SlPicture
                          className={"font-semibold text-md w-[15px] h-[15px]"}
                        />
                        <p className="flex-1 text-sm font-semibold relative z-20">
                          Thay đổi hình ảnh
                        </p>
                      </li>

                      <li
                        className="p-2 hover:bg-[#3e3e3e] rounded-b-md flex items-center gap-2 text-white relative z-20"
                        onClick={() => {
                          deleteFirebaseItem(imgUploaded);
                          setImgUploaded(null);
                          setMenuBar(false);
                          setUploadStatusImg(
                            "https://firebasestorage.googleapis.com/v0/b/spotify-clone-350f3.appspot.com/o/playlistDefault.png?alt=media&token=6cc2ab67-36e8-40cc-8ed7-0998d8b31a55"
                          );
                        }}
                      >
                        <TbTrashX className={"text-[17px] w-[17px] h-[17px]"} />
                        <p className="flex-1 text-sm font-semibold">
                          Xoá hình ảnh{" "}
                        </p>
                      </li>
                    </ul>
                  )}
                </div>
                <form className="relative z-10 flex-1 flex flex-col  pt-2 gap-4 h-full items-stretch">
                  {/* lg:max-h-[190px] max-h-[250px] */}
                  <div className="relative z-10 w-full">
                    <input
                      onBlur={() => {
                        if (formData.name === "") {
                          setNoti({
                            message: `Tên ${item.codeType.toLowerCase()} không được phép để trống`,
                            type: "error",
                          });
                        }
                      }}
                      value={formData.name}
                      onChange={(e) => {
                        if (e.target.value !== "") {
                          setNoti({ message: "", type: "" });
                        }
                        handleChangeForm(e, "name");
                      }}
                      type="text"
                      id="large-input"
                      className="block w-full py-2 px-3 text-sm  [&:focus+label]:block bg-[#3e3e3e] outline-none text-white focus:border focus:border-gray-500 rounded-md "
                    />
                    <label
                      for="large-input"
                      className=" hidden absolute -top-1 left-2 mb-2  text-[12px] font-semibold bg-[#282828] leading-[0.5]  text-secondaryText dark:text-white"
                    >
                      Tên
                    </label>
                  </div>
                  <div className="relative z-10 w-full flex-1 ">
                    <textarea
                      type="text"
                      value={formData.description}
                      onChange={(e) => {
                        handleChangeForm(e, "description");
                      }}
                      id="large-input"
                      placeholder={`Thêm mô tả`}
                      className="relative z-10 block w-full py-2 px-3 text-sm  [&:focus+label]:block bg-[#3e3e3e] outline-none text-white focus:border focus:border-gray-500 rounded-md  lg:h-[120px] "
                    />
                    <label
                      for="large-input"
                      className=" hidden absolute z-10 -top-1 left-2 mb-2  text-[12px] font-semibold bg-[#282828] leading-[0.5]  text-secondaryText dark:text-white"
                    >
                      Mô tả
                    </label>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer  */}
            <div>
              <div className="flex items-center justify-end  rounded-b ">
                <button
                  onClick={() => handleSubmit()}
                  data-modal-hide="default-modal"
                  type="button"
                  className=" rounded-full font-semibold hover:scale-105 bg-green-400 ms-3  text-md text-black px-5 py-2.5 text-center  "
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    </>
  );
}
export default EditPlaylistModal;
