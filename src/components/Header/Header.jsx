"use client";
// import { getAuth } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight, FaPlay, FaPlus } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
// import { app } from "../../config/firebase.config";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import * as authService from "../../services/authServices";
import {
  logoutFailure,
  logoutStart,
  logoutSuccess,
  registerFailure,
} from "../../redux/slice/auth.slice";
import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase/firebase.config";
import { fetchMyPlaylistsFailure } from "../../redux/slice/playlist.slice";
import Image from "next/image";

export default function Header({ isVisible, bgColor, title }) {
  const [showSubNav, setShowSubNav] = useState(false);
  const headerRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const currentUser = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [currentUser]);

  const handleLogOut = async () => {
    dispatch(logoutStart());

    const res = await authService.logout(userData.accessToken, {
      id: userData._id,
    });
    if (res) {
      if (res.success) {
        dispatch(logoutSuccess());
        dispatch(registerFailure(""));
        dispatch(fetchMyPlaylistsFailure());
        router.refresh();
      } else {
        dispatch(logoutFailure());
      }
    }
    const res2 = await authService.logoutGG({
      id: userData._id,
    });
    if (res2) {
      if (res2.success) {
        dispatch(logoutSuccess());
        dispatch(registerFailure(""));
        router.push("/");
      } else {
        dispatch(logoutFailure());
      }
    }

    const firebaseAuth = getAuth(app);
    firebaseAuth
      .signOut()
      .then(() => {
        router.refresh();
        dispatch(logoutSuccess());
        dispatch(registerFailure(""));
      })
      .catch((e) => {
        dispatch(logoutFailure());
      });
  };

  const boxRef = useRef(null);
  const nameRef = useRef(null);
  const handleClickOutside = (event) => {
    if (
      boxRef.current &&
      !boxRef.current.contains(event.target) &&
      !nameRef.current.contains(event.target)
    ) {
      setShowSubNav(false);
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
      ref={headerRef}
      className={`flex justify-between ml-4 fixed z-50 top-0 right-2 w-[calc(75%-24px)] z-100 py-4 rounded-t-lg mt-2 px-4 ${
        isVisible ? `${bgColor} shadow-lg` : " bg-transparent"
      } items-center `}
    >
      <div className="flex gap-2 items-center ">
        <button onClick={() => router.back()}>
          <FaAngleLeft className="bg-black text-secondaryText text-3xl p-1  rounded-[50%] " />
        </button>
        <button onClick={() => router.forward()}>
          <FaAngleRight className="bg-black text-secondaryText text-3xl p-1 rounded-[50%] " />
        </button>

        {isVisible && title}
      </div>

      {userData ? (
        <div className="flex items-center justify-center gap-2">
          <button className="p-1 flex items-center justify-center  bg-black w-8 h-8 rounded-full">
            <IoMdNotificationsOutline className="text-xl" />
          </button>
          <div
            ref={nameRef}
            onClick={() => {
              setShowSubNav(!showSubNav);
            }}
            className="flex items-center ml-auto cursor-pointer gap-2 relative z-100"
          >
            <Image
              width={40}
              height={40}
              src={
                userData?.imgURL
                  ? userData?.imgURL
                  : "/assets/default-avatar.jpg"
              }
              alt=""
              className="w-8 h-8  rounded-full object-cover shadow-lg"
              referrerPolicy="no-refferer"
            />

            {/* <div
              ref={nameRef}
              className="flex flex-col user-nav-container"
              onClick={() => {
                setShowSubNav(!showSubNav);
              }}
            >
              <p
                ref={nameRef}
                className="text-secondaryText text-md hover:text-white font-semibold"
              >
                {userData?.name}
              </p>
            </div> */}

            {showSubNav && (
              <motion.div
                ref={boxRef}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute min-w-[180px] z-100 top-12 right-0 w-225 p-1  bg-[#282828] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-md backdrop-blur-sm flex flex-col"
              >
                <Link href="/user-profile">
                  <p className=" rounded-t-md py-2.5 px-3 hover:bg-[#323232] text-secondaryText hover:text-white duration-150 transition-all ease-in-out">
                    Tài khoản
                  </p>
                </Link>
                <p className=" py-2.5 px-3  hover:bg-[#323232] text-secondaryText hover:text-white duration-150 transition-all ease-in-out">
                  Hồ sơ
                </p>
                <hr />

                {userData?.role === "admin" && (
                  <>
                    <Link href={"/"}>
                      <p className=" py-2.5 px-3  text-secondaryText hover:bg-[#323232] hover:text-white duration-150 transition-all ease-in-out">
                        Dashboard
                      </p>
                    </Link>
                  </>
                )}

                <p
                  className=" py-2.5 px-3  text-secondaryText hover:bg-[#323232] hover:text-white duration-150 transition-all rounded-b-md ease-in-out"
                  onClick={handleLogOut}
                >
                  Đăng xuất
                </p>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <Link
            href={"/signup"}
            className="rounded-full text-secondaryText mt-4 px-8 text-base  py-2  font-semibold"
          >
            Đăng ký
          </Link>

          <Link
            href={"/login"}
            className="rounded-full text-black mt-4 px-8 text-base   py-3 bg-white font-semibold"
          >
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}
