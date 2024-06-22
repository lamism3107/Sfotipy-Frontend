"use client";
// import { getAuth } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCrown,
  FaGreaterThan,
  FaLessThan,
} from "react-icons/fa";
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

export default function Header() {
  const [showSubNav, setShowSubNav] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef();
  const [userData, setUserData] = useState(null);
  const currentUser = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [currentUser]);

  const handleLogOut = async () => {
    dispatch(logoutStart());

    const res = await authService.logout(currentUser.accessToken, {
      id: currentUser._id,
    });
    if (res) {
      if (res.success) {
        dispatch(logoutSuccess());
        dispatch(registerFailure(""));
        dispatch(fetchMyPlaylistsFailure());
        console.log("logout success");
        router.push("/login");
      } else {
        dispatch(logoutFailure());
      }
    }
    const res2 = await authService.logoutGG({
      id: currentUser._id,
    });
    if (res2) {
      if (res2.success) {
        dispatch(logoutSuccess());
        dispatch(registerFailure(""));
        console.log("logout gg success");
        router.push("/login");
      } else {
        dispatch(logoutFailure());
      }
    }

    const firebaseAuth = getAuth(app);
    firebaseAuth
      .signOut()
      .then(() => {
        router.push("/login");
        dispatch(logoutSuccess());
        dispatch(registerFailure(""));
      })
      .catch((e) => {
        dispatch(logoutFailure());
      });
  };

  return (
    <div className="flex justify-between ml-4 fixed z-50 top-0 right-2 w-[calc(75%-24px)] z-100 py-4 rounded-t-lg mt-2 px-6 secondary_bg items-center ">
      <div className="flex gap-2 items-center ">
        <button>
          <FaAngleLeft className="bg-black text-secondaryText text-4xl p-1  rounded-[50%] " />
        </button>
        <button>
          <FaAngleRight className="bg-black text-secondaryText text-4xl p-1 rounded-[50%] " />
        </button>
      </div>
      {userData ? (
        <div className="flex items-center justify-center gap-2">
          <button className="p-1 flex items-center justify-center  bg-black w-8 h-8 rounded-full">
            <IoMdNotificationsOutline className="text-xl" />
          </button>
          <div className="flex items-center ml-auto cursor-pointer gap-2 relative z-100">
            <img
              src={
                userData?.imgURL
                  ? userData?.imgURL
                  : "/assets/default-avatar.jpg"
              }
              alt=""
              className="w-8 h-8  rounded-full object-cover shadow-lg"
              referrerPolicy="no-refferer"
            />

            <div
              className="flex flex-col user-nav-container"
              onClick={() => setShowSubNav(!showSubNav)}
            >
              <p className="text-secondaryText text-md hover:text-white font-semibold">
                {userData?.name}
              </p>
            </div>

            {showSubNav && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                ref={dropdownRef}
                className="absolute min-w-[140px] z-100 top-14 right-0 w-225 p-3 gap-2 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col"
              >
                <Link href="/user-profile">
                  <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                    Tài khoản
                  </p>
                </Link>
                <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                  Hồ sơ
                </p>
                <hr />

                {userData?.role === "admin" && (
                  <>
                    <Link href={"/"}>
                      <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                        Dashboard
                      </p>
                    </Link>
                  </>
                )}

                <p
                  className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out"
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
