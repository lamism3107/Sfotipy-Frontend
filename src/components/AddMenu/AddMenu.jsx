"use client";
import { useEffect, useRef, useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { IoAlbumsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const userOptions = {
  type: "playlist",
  icon: <IoAlbumsOutline className="text-lg  hover:text-green-400" />,
  title: "Tạo mới một playlist",
};
const artistOptions = [
  {
    type: "album",
    icon: <IoAlbumsOutline className="text-lg  hover:text-green-400" />,
    title: "Tạo mới một album",
  },
  {
    type: "song",
    icon: <BiAlbum className="text-lg hover:text-green-400" />,
    title: "Tạo mới một bài hát",
  },
  {
    type: "playlist",
    icon: <IoAlbumsOutline className="text-lg  hover:text-green-400" />,
    title: "Tạo mới một playlist",
  },
];
export const AddMenu = ({
  category,
  setCategory,
  handleSelect,
  buttonAddRef,
  isOpen,
  setIsOpen,
  isOpenModal,
  setIsOpenModal,
}) => {
  const user = useSelector((state) => state.auth.login.currentUser);

  const boxRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      boxRef.current &&
      !buttonAddRef.current.contains(event.target) &&
      !boxRef.current.contains(event.target)
    ) {
      setIsOpen((prev) => ({
        add: false,
        filter: false,
      }));
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div
      className="bg-[#282828] z-1000  w-fit add-menu  absolute top-[calc(100%+8px)] right-0 rounded-md  shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
      ref={boxRef}
    >
      {user ? (
        <>
          {user.role === "artist" ? (
            <>
              {artistOptions.map((item, index) => (
                <div
                  key={index}
                  className={`min-w-[190px]  w-full flex items-center ${
                    index === 0 && "mt-1"
                  } ${
                    index === 2 && "mb-1"
                  } text-md p-2.5  hover:text-green-400  gap-3 bg-[#282828] hover:bg-[#323232] `}
                  onClick={() => {
                    setCategory(item.type);
                    handleSelect(item.type);
                  }}
                >
                  {item.icon}
                  <p>{item.title}</p>
                </div>
              ))}
            </>
          ) : (
            <>
              <div
                className="min-w-[190px]  w-full flex items-center my-1 text-md p-2.5  hover:text-green-400  gap-3 bg-[#282828] hover:bg-[#323232] "
                onClick={() => {
                  setCategory(item.type);
                  handleSelect(item.type);
                }}
              >
                <IoAlbumsOutline className="text-lg  hover:text-green-400" />
                <p>Tạo mới một playlist</p>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div
            className="min-w-[190px]  w-full flex items-center my-1 text-md p-2.5  hover:text-green-400  gap-3 bg-[#282828] hover:bg-[#323232] "
            onClick={() => {
              setIsOpenModal(true);
            }}
          >
            <IoAlbumsOutline className="text-lg  hover:text-green-400" />
            <p>Tạo mới một playlist</p>
          </div>
        </>
      )}
    </div>
  );
};
