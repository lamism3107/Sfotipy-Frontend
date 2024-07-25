"use client";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as playlistServices from "../../services/playlist.api.js";
import * as songServices from "../../services/song.api.js";
import * as libraryServices from "../../services/library.api.js";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

import Image from "next/image";
import SongForm from "./SongForm";
import UploadImg from "../UploadImg/UploadImg";
import { languageList } from "../../constants/initValue";
import { addItemToLibrary } from "../../redux/slice/library.slice";

function CreateSongModal({ isOpen, setIsOpen, album }) {
  const dispatch = useDispatch();
  const [noti, setNoti] = useState([]);
  const [isExit, setIsExit] = useState(false);
  const user = useSelector((state) => state.auth.login.currentUser);
  const [imgUploaded, setImgUploaded] = useState(album?.thumbnail || "");
  const [formData, setFormData] = useState({
    name: "",
    album: null,
    thumbnail: "",
    songURL: "",
    language: "",
    length: 0,
    artists: [user?._id],
    composers: "",
    producers: "",
    album: album ? album._id : "",
    genres: [],
    description: "",
  });
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: imgUploaded,
    }));
  }, [imgUploaded]);

  useEffect(() => {
    if (formData.genres.length > 0) {
    }
  }, []);
  const handleClickCloseButton = () => {
    if (
      formData.artists.length > 1 ||
      formData.genres.length > 0 ||
      formData.language !== "" ||
      formData.name !== "" ||
      formData.composers !== "" ||
      formData.producers !== "" ||
      formData.songURL !== "" ||
      formData.description !== "" ||
      formData.thumbnail !== ""
    ) {
      if (!isExit) {
        alert(
          `Bạn chưa lưu bài hát! Nhấn "Lưu" để lưu bài hát hoặc nhấn "X" lần nữa để thoát`
        );
        setIsExit(true);
      } else {
        setIsExit(true);
        setIsOpen(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  const validateFormData = () => {
    let isValid = true;
    if (noti.length > 0) {
      return;
    } else {
      if (formData.name === "") {
        setNoti((prev) => [...prev, "name"]);
        isValid = false;
      }
      if (formData.language === "") {
        setNoti((prev) => [...prev, "language"]);
      }
      if (formData.genres.length === 0) {
        setNoti((prev) => [...prev, "genres"]);
      }
      if (formData.thumbnail === "") {
        setNoti((prev) => [...prev, "thumbnail"]);
      }
      if (formData.songURL === "") {
        setNoti((prev) => [...prev, "songURL"]);
      }
    }

    return isValid;
  };
  const handleSubmit = async () => {
    if (!validateFormData()) return;
    const res1 = await songServices.createNewSong(formData);
    if (res1 && res1.success) {
      const res2 = await playlistServices.addSongToPlaylistAlbum(
        formData.album,
        res1.data._id
      );
      if (res2 && res2.success) {
        const res3 = await libraryServices.addSongToLibrary(res1.data._id);
        dispatch(addItemToLibrary(res3.data));
        if (res3 && res3.success) {
          toast.success("Thêm bài hát vào thư viện thành công!");
          alert("Success!");
          setIsOpen(false);
        }
      }
    }
  };

  return (
    <>
      (
      <div className=" bg-modalOverlay overflow-y-hidden overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0  max-h-full">
        <div
          className={` absolute left-[50%] translate-x-[-50%] top-[50%]  w-4/5 overflow-y-hidden translate-y-[-50%] h-[90vh]
            } `}
        >
          <div className="relative bg-[#282828] shadow py-6 pr-6 pl-5 rounded-lg h-[90vh]">
            <div className="flex items-center justify-between   rounded-t ">
              <h3 className="text-2xl font-semibold text-white  text-center">
                Tạo mới bài hát
              </h3>
              <button
                onClick={handleClickCloseButton}
                type="button"
                className="-mr-2 -mt-2 text-gray-400 bg-bt hover:bg-[#3e3e3e] rounded-full  w-8 h-8 ms-auto inline-flex justify-center items-center text-xl"
              >
                <IoClose className="text-lg" />
              </button>
            </div>

            {/* Body  */}
            <div className="mt-4 mb-6 pt-2 pb-4 border border-x-0 border-t-slate-600 border-b-slate-600  h-[80%] ">
              {/* Song Info Form  */}
              <div className={` flex gap-4 h-full   text-black`}>
                {/* Img Area  */}
                {!album ? (
                  <div className="w-1/4 flex flex-col gap-1.5 relative z-20 -ml-1 p-2">
                    <label
                      htmlFor="large-input"
                      className="  text-md font-semibold bg-[#282828]   text-white"
                    >
                      Ảnh bìa
                    </label>
                    <UploadImg
                      imgUploaded={imgUploaded}
                      setImgUploaded={setImgUploaded}
                    />
                  </div>
                ) : (
                  <div
                    // style={{ boxShadow: "0 4px 4px rgba(0,0,0,.3)" }}
                    className="w-1/4 relative flex flex-col gap-2 z-20 -ml-1 p-2"
                  >
                    <label
                      htmlFor="large-input"
                      className="  text-md font-semibold bg-[#282828]   text-white"
                    >
                      Ảnh bìa album
                    </label>
                    <div className="flex w-full pt-[100%] flex-col relative z-20  items-center rounded-md justify-center  shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
                      <div className="absolute inset-0">
                        <Image
                          onMouseEnter={() => {
                            setChoosePhoto(true);
                          }}
                          width={180}
                          height={180}
                          src={imgUploaded}
                          alt="playlistImg"
                          className=" object-cover w-full h-full rounded-md"
                        />
                        <div className="absolute  inset-0">
                          <Image
                            width={180}
                            height={180}
                            src={
                              album?.thumbnail !== ""
                                ? album.thumbnail
                                : "/assets/playlistDefault.png"
                            }
                            alt="playlistImg"
                            className="absolute   inset-0 object-cover w-full h-full rounded-md"
                          />
                        </div>
                        {/* } */}
                      </div>
                    </div>
                  </div>
                )}

                <SongForm
                  noti={noti}
                  setNoti={setNoti}
                  formData={formData}
                  setFormData={setFormData}
                  album={album}
                />
              </div>
            </div>

            {/* Footer  */}
            <div>
              <div className="flex items-center justify-end  rounded-b ">
                <button
                  onClick={() => handleSubmit()}
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
export default CreateSongModal;
