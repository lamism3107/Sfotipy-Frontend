import React, { useEffect, useRef, useState } from "react";
import { SlPicture } from "react-icons/sl";
import { TbTrashX } from "react-icons/tb";
import { deleteFirebaseItem, uploadFile } from "../../utils/helperFuncs";
import Image from "next/image";
import { BsThreeDots } from "react-icons/bs";
import { IoMdCloudUpload } from "react-icons/io";

export default function UploadImg({ imgUploaded, setImgUploaded }) {
  const imgInputRef = useRef(null);
  const menuBarRef = useRef(null);
  const closeMenuBtn = useRef(null);
  const [menuBar, setMenuBar] = useState(false);
  const [choosePhoto, setChoosePhoto] = useState(false);

  useEffect(() => {
    setChoosePhoto(false);
  }, [imgUploaded]);
  const handleClickOutsideMenu = (event) => {
    if (
      menuBarRef.current &&
      !menuBarRef.current.contains(event.target) &&
      !closeMenuBtn.current.contains(event.target)
    ) {
      setMenuBar(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMenu);
    };
  }, []);
  return (
    <>
      {imgUploaded ? (
        <div className="flex w-full pt-[100%] flex-col relative z-20  items-center rounded-md justify-center  shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className="absolute inset-0">
            <Image
              onMouseEnter={() => {
                setChoosePhoto(true);
              }}
              width={200}
              height={200}
              src={imgUploaded}
              alt="playlistImg"
              className=" object-cover w-full h-full rounded-md"
            />
            {choosePhoto && (
              <div
                className="absolute  inset-0"
                onMouseLeave={() => setChoosePhoto(false)}
              >
                <Image
                  width={200}
                  height={200}
                  src={"/assets/choosePhoto.png"}
                  alt="playlistImg"
                  className="absolute opacity-70  inset-0 object-cover w-full h-full rounded-md"
                />
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
                      if (imgUploaded) deleteFirebaseItem(imgUploaded);
                      uploadFile(e, "albumImg", setImgUploaded);
                    }}
                  />
                </label>
              </div>
            )}
          </div>
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
        <div className="relative cursor-pointer w-full pt-[100%] ">
          <label className="absolute inset-0 cursor-pointer ">
            <div className="flex flex-col items-center rounded-md justify-center h-full shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <div className="flex flex-col justify-center w-full h-full items-center rounded-md ">
                <p className="font-bold text-2xl text-secondaryText">
                  <IoMdCloudUpload />
                </p>
                <p className="text-lg text-center text-secondaryText">
                  Nhấn để thêm ảnh bìa
                </p>
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
                uploadFile(e, "albumImg", setImgUploaded);
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
            <label className="w-full h-full absolute z-10 left-0 right-0 ">
              <input
                ref={imgInputRef}
                type="file"
                name="upload-file"
                id={"imgInputRef"}
                //Nếu isImage=true thì chấp nhận mọi file có có type là image. Ngược lại các file có type là audio
                accept="image/*"
                className="w-0 h-0 hidden absolute cursor-pointer z-20"
                onChange={(e) => {
                  uploadFile(e, "albumImg", setImgUploaded);
                  setMenuBar(false);
                }}
              />
            </label>

            <SlPicture className={"font-semibold text-md w-[15px] h-[15px]"} />
            <p className="select-none flex-1 text-sm font-semibold relative z-0">
              Thay đổi hình ảnh
            </p>
          </li>

          <li
            className="p-2 hover:bg-[#3e3e3e] rounded-b-md flex items-center gap-2 text-white relative z-20"
            onClick={() => {
              if (imgUploaded) deleteFirebaseItem(imgUploaded);
              setImgUploaded("");
              setMenuBar(false);
            }}
          >
            <TbTrashX className={"text-[17px] w-[17px] h-[17px]"} />
            <p className="flex-1 text-sm font-semibold">Xoá hình ảnh </p>
          </li>
        </ul>
      )}
    </>
  );
}
