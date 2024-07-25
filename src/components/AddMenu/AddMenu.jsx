"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiAlbum } from "react-icons/bi";
import { IoAlbumsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentCategory } from "../../redux/slice/library.slice";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

const userOptions = {
  type: "playlist",
  icon: <IoAlbumsOutline className="text-lg  hover:text-green-400" />,
  title: "Tạo mới một playlist",
};
const artistOptions = [
  {
    type: "Album",
    icon: <IoAlbumsOutline className="text-lg  hover:text-green-400" />,
    title: "Tạo mới một album",
  },
  {
    type: "Song",
    icon: <BiAlbum className="text-lg hover:text-green-400" />,
    title: "Tạo mới một bài hát",
  },
  {
    type: "Playlist",
    icon: <IoAlbumsOutline className="text-lg  hover:text-green-400" />,
    title: "Tạo mới một playlist",
  },
];
export const AddMenu = ({
  handleSelect,
  buttonAddRef,
  setIsOpenMenu,
  isOpen,
  setIsOpen,
}) => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const reduxCurrentCategory = useSelector(
    (state) => state.library.currentCategory
  );
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const addMenuBoxRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      addMenuBoxRef.current &&
      !buttonAddRef.current.contains(event.target) &&
      !addMenuBoxRef.current.contains(event.target)
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
      className="bg-[#282828] z-1000  w-fit add-menu  absolute top-[calc(100%+8px)] right-0 rounded-md overflow-hidden  shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
      ref={addMenuBoxRef}
    >
      {user ? (
        <>
          {user.role === "artist" ? (
            <>
              {artistOptions.map((item, index) => (
                <div
                  key={index}
                  className={`min-w-[190px]  w-full flex items-center text-md px-2.5 py-2  hover:text-green-400  gap-3 bg-[#282828] hover:bg-[#323232] `}
                  onClick={() => {
                    handleSelect(item.type);
                    setIsOpenMenu(() => {
                      return {
                        add: false,
                        filter: false,
                      };
                    });
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
                className="min-w-[190px]  w-full flex items-center my-1 text-md px-2.5 py-1.5 hover:text-green-400  gap-3 bg-[#282828] hover:bg-[#323232] "
                onClick={() => {
                  handleSelect("Playlist");
                  setIsOpenMenu(() => ({
                    add: false,
                    filter: false,
                  }));
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
              setIsOpenConfirmModal(true);
            }}
          >
            <IoAlbumsOutline className="text-lg  hover:text-green-400" />
            <p>Tạo mới một playlist</p>
          </div>
        </>
      )}
      {isOpenConfirmModal && (
        <ConfirmModal
          setIsOpen={setIsOpenConfirmModal}
          isOpen={isOpenConfirmModal}
          title="Tạo mới một playlist"
          cancelButton="Không phải bây giờ"
          okButton="Đăng nhập "
          onOk={() => {
            router.push("/login");
          }}
          children="Hãy đăng nhập để tạo vào chia sẻ playlist của bạn"
        />
      )}
    </div>
  );
};
