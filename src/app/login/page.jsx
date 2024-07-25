"use client";

import React, { useContext, useEffect, useState } from "react";
// import { Context } from "../../context/StateProvider";
// import * as authService from "../../services/authService";
// import { actionTypes } from "../../context/actionTypes";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiErrorWarningLine } from "react-icons/ri";
import * as authService from "../../services/authServices";
import { app } from "../../config/firebase/firebase.config";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../redux/slice/auth.slice";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const existedEmail = useSelector(
    (state) => state?.auth?.register?.existedEmail
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validate, setValidate] = useState({});
  const [errMessage, setErrMessage] = useState("");

  useEffect(() => {
    if (existedEmail !== "") {
      setFormData({
        email: existedEmail,
        password: "",
      });
    }
  }, [existedEmail]);
  const validateEmail = () => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(formData.email)) {
      setValidate((prev) => ({
        ...prev,
        email:
          "This email is invalid. Make sure it's written like example@email.com",
      }));
      return false;
    }
    return true;
  };
  const validatePassword = () => {
    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      setValidate((prev) => ({
        ...prev,
        password:
          "Password must have atleast 6 characters and contains atleast 1 number or special characters (example: # ? ! &)",
      }));
      return false;
    }
    return true;
  };

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const loginWithGoogle = async () => {
    dispatch(loginStart());
    await signInWithPopup(firebaseAuth, provider)
      .then((res) => {
        if (res) {
          firebaseAuth.onAuthStateChanged((userCred) => {
            if (userCred) {
              userCred.getIdToken().then((token) => {
                authService.loginWithGoogle(token).then((data) => {
                  if (data && data.success) {
                    dispatch(loginSuccess(data.data));
                    router.push("/");
                  }
                });
              });
            } else {
              router.push("/login");
              dispatch(loginFailure());
            }
          });
        }
      })
      .catch((err) => {
        console.log("firebaseAuth error: " + err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail();
    validatePassword();
    if (!validateEmail() || !validatePassword()) {
      return;
    }
    const data = formData;
    dispatch(loginStart());
    const res = await authService.login(data);
    if (res) {
      if (res.success) {
        router.push("/");
        dispatch(loginSuccess(res.data));
        setFormData({
          email: "",
          password: "",
        });
      } else {
        setErrMessage("Email hoặc mật khẩu không chính xác!", res.message);

        dispatch(loginFailure());
      }
    }
  };

  return (
    <>
      <div className="container py-10 linear_bg h-[100vh] overflow-y-scroll">
        <div className="bg-secondaryBg rounded-lg py-10 text-center w-1/2 mx-auto ">
          <div
            onClick={() => router.push("/")}
            className="cursor-pointer logo flex items-center justify-center"
          >
            <Image
              src="/assets/logo-white-icon.png"
              width={50}
              height={50}
              alt="logo"
            />
          </div>
          <h1 className="text-4xl my-12 font-semibold">
            Đăng nhập vào spotify
          </h1>

          <div className="flex flex-col gap-1 items-center justify-center">
            <div
              className="flex items-center justify-center w-1/2  gap-2 px-10 py-3 border border-gray-600 hover:border-white my-2 rounded-full font-semibold cursor-pointer duration-100 ease-in-out transition-all"
              onClick={loginWithGoogle}
            >
              <FcGoogle className="text-xl  inline-block" />

              <span className="text-left ">Tiếp tục bằng Google</span>
            </div>
            <div
              className=" flex items-center justify-center w-1/2 gap-2 px-10 py-3 border border-gray-600 hover:border-white my-2 rounded-full font-semibold cursor-pointer duration-100 ease-in-out transition-all"
              onClick={loginWithGoogle}
            >
              <FaFacebook className="text-xl text-center  inline-block" />

              <span className="text-center ">Tiếp tục bằng Facebook</span>
            </div>
            <div
              className="flex items-center justify-center w-1/2  gap-2 px-10 py-3 border border-gray-600 hover:border-white my-2 rounded-full font-semibold cursor-pointer duration-100 ease-in-out transition-all"
              // onClick={loginWithGoogle}
            >
              <FaGithub className="text-center  text-xl  inline-block" />
              <span className="text-center  ">Tiếp tục bằng Github</span>
            </div>
          </div>
          <div className="border-b border-gray-700 w-3/4 my-8 mx-auto"></div>
          {errMessage !== "" && (
            <div className="w-[90%] mx-auto px-8 py-3 my-3 bg-red-600 text-white flex items-center justify-center">
              <RiErrorWarningLine className="inline mr-2 text-lg" />
              {errMessage}
            </div>
          )}
          <form className="text-center mx-auto w-1/2 ">
            <div className="w-full text-left py-4">
              <label
                htmlFor="email"
                className="font-semibold mb-2 inline-block"
              >
                Địa chỉ Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onBlur={validateEmail}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setValidate((prev) => ({
                      ...prev,
                      email: "",
                    }));
                  }
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                }}
                required
                placeholder={`Email`}
                className={`block w-full rounded-[4px] border-0  text-gray-300 shadow-sm ring-1 ring-inset ${
                  validate.email && validate.email !== ""
                    ? "ring-red-500 focus:ring-red-600 "
                    : "ring-gray-300 focus:ring-white-600"
                } placeholder:text-gray-400 focus:ring-[3px] focus:ring-inset  outline-none p-3  bg-[#1a1919] `}
              />
              {validate.email && validate.email !== "" && (
                <span className="text-sm text-red-500 flex items-center  mt-2">
                  <RiErrorWarningLine className="inline mr-2 text-red-500 text-lg" />
                  {validate.email}
                </span>
              )}
            </div>

            <div className="w-full text-left py-4">
              <label
                htmlFor="password"
                className="font-semibold mb-2 inline-block"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onBlur={validatePassword}
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setValidate((prev) => ({
                      ...prev,
                      password: "",
                    }));
                  }
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                }}
                required
                placeholder="Password"
                className={`block w-full rounded-[4px] border-0  text-gray-300 shadow-sm ring-1 ring-inset ${
                  validate.password && validate.password !== ""
                    ? "ring-red-500"
                    : "ring-gray-300"
                } placeholder:text-gray-400 focus:ring-[3px] focus:ring-inset focus:ring-white-600 outline-none p-3 hover:ring-white bg-[#1a1919] `}
              />
              {validate.password && validate.password !== "" && (
                <span className="text-sm text-red-500 flex items-center  mt-2">
                  <RiErrorWarningLine className="inline mr-2 text-red-500 text-lg w-[32px]" />
                  <p className="">{validate.password}</p>
                </span>
              )}
            </div>
            <div className="w-full text-left py-4">
              <input
                type="submit"
                value="Đăng nhập"
                placeholder="Đăng nhập"
                className="block cursor-pointer w-full outline-none bg-green-400 text-black p-3 hover:scale-105 translate-all duration-200  font-semibold text-center rounded-full "
                onClick={handleSubmit}
              />
            </div>
            <div className="w-full text-center py-4">
              <Link
                href="/password/forgot"
                className="text-white font-semibold underline mx-auto"
              >
                Quên mật khẩu của bạn?
              </Link>
            </div>
          </form>
          <div className="border-b border-gray-700 w-3/4 my-8 mx-auto"></div>
          <p className="pt-3">
            <span className="text-gray-300 text-sm font-semibold">
              Bạn chưa có tài khoản?{" "}
            </span>

            <Link
              href="/signup"
              className="text-white hover:text-green-500 font-semibold underline mx-auto"
            >
              Đăng kí Spotify
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
