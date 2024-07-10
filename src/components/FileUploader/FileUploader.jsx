import React from "react";

export default function FileUploader({ fileCategory }) {
  return (
    <div>
      {imgUploaded ? (
        <div className="flex flex-col p-2 items-center rounded-md justify-center h-full ">
          <img
            src={imgUploaded}
            alt="playlistImg"
            className="object-cover w-full h-full rounded-md"
          />
          <button
            ref={closeMenuBtn}
            className={`absolute top-4 right-4 p-2 rounded-full ${
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
        <div className="relative cursor-pointer w-[200px] h-[200px]  p-2">
          <label className="w-full h-full cursor-pointer ">
            <div className="flex flex-col items-center rounded-md justify-center h-full shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
              <div
                className="flex flex-col justify-center w-full h-full items-center rounded-md "
                onMouseEnter={() => {
                  setUploadStatusImg("/assets/choosePhoto.png");
                }}
                onMouseLeave={() => {
                  setUploadStatusImg("/assets/playlistDefault.png");
                }}
              >
                <img
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
              className="w-0 h-0 hidden absolute cursor-pointer"
              onChange={(e) => handleInputFileChange(e)}
            />
            <button
              ref={closeMenuBtn}
              className="absolute top-4 right-4  p-2 rounded-full bg-[#202020] text-white hover:bg-white hover:text-black cursor-pointer outline-none border-none hover:shadow-me duration-200 transition-all ease-in-out"
              onClick={() => {
                setMenuBar(!menuBar);
              }}
            >
              <BsThreeDots className="text-md" />
            </button>
          </label>
        </div>
      )}
    </div>
  );
}
