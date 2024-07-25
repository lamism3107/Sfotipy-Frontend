import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UploadAudio from "../UploadAudio/UploadAudio";
import Dropdown from "../Dropdown/Dropdown";
import { languageList } from "../../constants/initValue";
import ChipDropdown from "../ChipDropdown/ChipDropdown";
import * as genreServices from "../../services/genre.api";
import * as userServices from "../../services/user.api";
import ChipInput from "../ChipInput/ChipInput";

export default function SongForm({
  noti,
  setNoti,
  formData,
  setFormData,
  album,
}) {
  const user = useSelector((state) => state.auth.login.currentUser);
  const reduxMyAlbums = useSelector(
    (state) => state?.playlist?.myPlaylists.myAlbums
  );
  //Song props
  const [songURL, setSongURL] = useState("");

  const [fetchedGenres, setFetchedGenres] = useState([]);
  const [searchArtistResult, setSearchArtistResult] = useState([]);
  const [isFoundArtist, setIsFoundArtist] = useState(false);
  const typingTimeoutRef = useRef(null);

  //Search Item By Name
  const searchArtistByName = async (name) => {
    const listData = await userServices.getArtistByName(name);
    if (listData && listData.success) {
      if (listData.data.length > 0) {
        setIsFoundArtist(true);
        setSearchArtistResult(listData.data);
      } else {
        setIsFoundArtist(false);
      }
    }
  };

  const handleSearchArtist = (searchValue) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      if (searchValue !== "") {
        searchArtistByName(searchValue);
      } else {
        return;
      }
    }, 300);
  };

  useEffect(() => {
    const getAllGenres = async () => {
      const res = await genreServices.getAllGenres();
      if (res && res.data) {
        setFetchedGenres(res.data);
      }
    };
    getAllGenres();
  }, []);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      songURL: songURL,
    }));
    setNoti((prev) => {
      const tmp = [...noti];
      let newNoti = tmp.filter((noti) => noti !== "songURL");
      return newNoti;
    });
  }, [songURL]);
  console.log("noti", noti);
  return (
    <form className="relative z-10 overflow-y-auto flex-1 flex flex-col  pt-2 gap-4 h-full items-stretch pr-2">
      {/* Name & Album */}
      <div className="flex items-start justify-stretch gap-5">
        <div className="relative z-10 flex-1 flex flex-col">
          <label
            htmlFor="large-input"
            className="  text-md font-semibold bg-[#282828]   text-white"
          >
            Tên
          </label>
          <input
            placeholder="Nhập tên bài hát..."
            name="name"
            value={formData.name}
            onChange={(e) => {
              if (e.target.value !== "")
                setNoti((prev) => {
                  const tmp = [...noti];
                  let newNoti = tmp.filter((noti) => noti !== "name");
                  return newNoti;
                });
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
            type="text"
            id="large-input"
            className={`block w-full my-1 py-2 px-3 text-sm  bg-[#3e3e3e] outline-none text-white border border-gray-600 ${
              noti.includes("name")
                ? "border-red-500 hover:border-red-500"
                : "border-gray-600  hover:border-secondaryText focus:border-secondaryText "
            }  rounded-md `}
          />
          {noti.includes("name") && (
            <i className=" text-red-500 font-thin text-sm">
              *Trường thông tin này không được phép để trống
            </i>
          )}
        </div>
        {album && (
          <div className="relative z-10 flex-1 flex flex-col">
            <label
              htmlFor="large-input"
              className="  text-md font-semibold bg-[#282828]   text-white"
            >
              Album
            </label>
            <input
              name="album"
              value={album.name}
              disabled={true}
              type="text"
              id="large-input"
              className=" block w-full my-1 py-2 px-3 text-sm  bg-[#3e3e3e] outline-none text-secondaryText border border-gray-600 rounded-md "
            />
          </div>
        )}
      </div>

      {/* Upload Audio  */}
      <div className=" flex flex-col justify-center">
        <div
          className={`w-fullgap-2 ${
            noti.includes("songURL")
              ? "border-red-500 hover:border-red-500"
              : "border-gray-600  hover:border-secondaryText focus:border-secondaryText "
          } bg-[#3e3e3e] cursor-pointer text-white border rounded-md  mb-1`}
        >
          <div className="flex gap-3 py-5 items-center justify-center h-32  ">
            <UploadAudio songURL={songURL} setSongURL={setSongURL} />
          </div>
        </div>
        {noti.includes("songURL") && (
          <i className=" text-red-500 font-thin text-sm">
            *Trường thông tin này không được phép để trống
          </i>
        )}
      </div>

      {/* Language && Genre */}
      <div className="flex items-start justify-stretch gap-5 relative z-30">
        <div className="relative z-10 flex-1 flex flex-col">
          <label
            htmlFor="large-input"
            className="text-md font-semibold bg-[#282828]   text-white"
          >
            Ngôn ngữ
          </label>
          <Dropdown
            noti={noti}
            setNoti={setNoti}
            item="language"
            formData={setFormData}
            setFormData={setFormData}
            listValue={languageList}
          />
          {formData.language === "" ? (
            <>
              {noti.includes("language") && (
                <i className=" text-red-500 font-thin text-sm">
                  *Trường thông tin này không được phép để trống
                </i>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          <label
            htmlFor="large-input"
            className="text-md font-semibold bg-[#282828]   text-white"
          >
            Thể loại
          </label>
          <ChipDropdown
            item={"genres"}
            formData={formData}
            setFormData={setFormData}
            dropdownList={fetchedGenres}
          />
          {formData.genres.length === 0 ? (
            <>
              {noti.includes("genres") && (
                <i className=" text-red-500 font-thin text-sm">
                  *Trường thông tin này không được phép để trống
                </i>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* Performed by  */}
      <div className="relative z-20 w-full flex-1">
        <label
          htmlFor="large-input"
          className="mb-2  text-md font-semibold bg-[#282828]   text-white"
        >
          Thể hiển bởi
        </label>
        <ChipInput
          item={"artists"}
          formData={formData}
          setFormData={setFormData}
          dropdownList={searchArtistResult}
          setDropdownList={setSearchArtistResult}
          handleSearch={handleSearchArtist}
          isFoundData={isFoundArtist}
          placeholder="Nhập tên nghệ sĩ khác"
          setIsFoundData={setIsFoundArtist}
        />
      </div>

      {/* Composer & Producer  */}
      <div className="relative z-10 w-full gap-5 flex items-start flex-1">
        <div className="w-1/2">
          <label
            htmlFor="large-input"
            className="mb-2  text-md font-semibold bg-[#282828]   text-white"
          >
            Sáng tác bởi
            <i className="ml-2 text-secondaryText text-[14px] font-medium">
              (* tuỳ chọn)
            </i>
          </label>
          <input
            placeholder="Nhập tên nghệ sĩ..."
            name="composers"
            value={formData.composers}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                composers: e.target.value,
              }));
            }}
            type="text"
            id="large-input"
            className={`block w-full my-1 py-2 px-3 text-sm  bg-[#3e3e3e] outline-none text-white border border-gray-600  hover:border-secondaryText focus:border-secondaryText rounded-md `}
          />
        </div>
        <div className="w-1/2">
          <label
            htmlFor="large-input"
            className="mb-2  text-md font-semibold bg-[#282828]   text-white"
          >
            Sản xuất bởi
            <i className="ml-2 text-secondaryText text-[14px] font-medium">
              (* tuỳ chọn)
            </i>
          </label>
          <input
            placeholder="Nhập tên nghệ sĩ..."
            name="producers"
            value={formData.producers}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                producers: e.target.value,
              }));
            }}
            type="text"
            id="large-input"
            className={`block w-full my-1 py-2 px-3 text-sm  bg-[#3e3e3e] outline-none text-white border border-gray-600  hover:border-secondaryText focus:border-secondaryText  rounded-md `}
          />
          {noti.type === "producers" && (
            <i className=" text-red-500 font-thin text-sm">*{noti.message}</i>
          )}
        </div>
      </div>

      {/* Description  */}
      <div className="relative z-0 w-full flex-1">
        <label
          htmlFor="large-input"
          className="mb-2  text-md font-semibold bg-[#282828]   text-white"
        >
          Mô tả
          <i className="ml-2 text-secondaryText text-[14px] font-medium">
            (* tuỳ chọn)
          </i>
        </label>
        <textarea
          type="text"
          value={formData.description}
          onChange={(e) => {
            setFormData((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
          id="large-input"
          placeholder={`Thêm mô tả`}
          className="relative z-10 block w-full py-2 px-3 text-sm mt-1 mb-4  bg-[#3e3e3e] outline-none text-white focus:border focus:border-gray-500 rounded-md  lg:h-[120px] "
        />
      </div>
    </form>
  );
}
