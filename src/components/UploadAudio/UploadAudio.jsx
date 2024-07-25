"use client";
import React, { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { deleteFirebaseItem } from "../../utils/helperFuncs";
import { storage } from "../../config/firebase/firebase.config";

import { TbTrashX } from "react-icons/tb";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
export default function UploadAudio({ songURL, setSongURL }) {
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);
  const [isAudioUploading, setIsAudioUploading] = useState(false);

  const uploadAudio = (e) => {
    setIsAudioUploading(true);
    const file = e.target.files[0];
    let firebasePath = "audio";
    const storageRef = ref(
      storage,
      `${firebasePath}/${Date.now()}-${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setAudioUploadProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
        toast.error("Upload failed", error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setIsAudioUploading(false);
          setSongURL(downloadURL);
          toast.success("Upload successful");
        });
      }
    );
  };
  const handleChangeAudio = (e) => {
    uploadAudio(e);
  };
  const handleDeleteAudio = (e) => {
    if (songURL) {
      deleteFirebaseItem(songURL);
    }
    setSongURL("");
  };
  return (
    <>
      {isAudioUploading ? (
        <>
          <p className="text-xl font-semibold text-white">
            {Math.round(audioUploadProgress) > 0 && (
              <>{`${Math.round(audioUploadProgress)}%`}</>
            )}
          </p>
          <div className="absolute  w-20 h-20 min-w-[40px] bg-green-400 animate-ping rounded-full flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-green-400 blur-xl"></div>
          </div>
        </>
      ) : (
        <>
          {songURL !== "" ? (
            <div className="flex w-full gap-3 py-5 items-center justify-center h-32 px-5 ">
              <audio
                className="flex-1 w-full bg-transparent"
                src={songURL}
                controls
                // className="w-full h-full object-contain"
              ></audio>
              <button
                className=" p-3 rounded-full bg-red-500 cursor-pointer outline-none border-none hover:shadow-lg duration-200 transition-all ease-in-out"
                onClick={() => handleDeleteAudio()}
              >
                <TbTrashX className="text-white text-md" />
              </button>
            </div>
          ) : (
            <label className="block h-32">
              <div className="flex  items-center justify-center h-32">
                <div className="flex flex-col justify-center items-center">
                  <p className="font-bold text-2xl text-secondaryText">
                    <IoMdCloudUpload />
                  </p>
                  <p className="text-lg text-secondaryText">
                    Nhấn để upload bài hát
                  </p>
                </div>
              </div>
              <input
                type="file"
                name="upload-file"
                //Nếu isImage=true thì chấp nhận mọi file có có type là image. Ngược lại các file có type là audio
                accept={"audio/*"}
                className="w-0 h-0 cursor-pointer"
                onChange={(e) => handleChangeAudio(e)}
              />
            </label>
          )}
        </>
      )}
    </>
  );
}
