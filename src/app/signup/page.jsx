"use client";
import React, { useEffect, useState } from "react";
import "./signup.css";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { RiErrorWarningLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "../../config/firebase/firebase.config";

import * as authService from "../../services/authServices";
import * as libraryService from "../../services/libraryServices";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
} from "../../redux/slice/auth.slice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ gender: "male" });
  const [validate, setValidate] = useState({});
  const [error, setError] = useState(false);

  const validateEmail = () => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(formData?.email.trim())) {
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
  const validateName = async () => {
    if (!formData.name || formData.name === "") {
      setValidate((prev) => ({
        ...prev,
        name: "this field must be filled",
      }));
      return false;
    }
    return true;
  };

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const loginWithGoogle = async () => {
    dispatch(loginStart());
    await signInWithPopup(firebaseAuth, provider).then((res) => {
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
            router.push("/signup");
            dispatch(loginFailure());
          }
        });
      }
    });
  };

  const createLibrary = async (data) => {
    const initLibrary = {
      owner: data._id,
      songs: [],
      playlists: [],
      artists: [],
    };

    libraryService.createNewLibrary(initLibrary).then((res) => {
      window.localStorage.setItem("library", res.data._id);
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    validateEmail();
    validatePassword();
    validateName();
    if (!validateEmail() || !validatePassword() || !validateName()) {
      return;
    }
    formData.codeType = "user";
    dispatch(registerStart());
    await authService.register(formData).then((res) => {
      if (res?.success) {
        dispatch(registerSuccess(formData.email));
        setError(false);
        toast.success("Đăng ký tài khoản thành công!", { autoClose: 2500 });
        toast.info("Chuyển hướng sang trang đăng nhập", {
          delay: 2400,
          autoClose: 3000,
        });
        createLibrary(res.data);
        setTimeout(() => router.push("/login"), 5500);
      } else {
        dispatch(registerFailure(formData.email));
        setError(true);
      }
    });
  };

  return (
    <>
      <div className="container py-8 bg-secondaryBg overflow-y-scroll max-h-[100vh]">
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
        <div className=" text-white">
          <div className="pb-10 text-center w-1/2 mx-auto">
            <h1 className="text-4xl tracking-tighter my-6 font-semibold">
              Đăng ký để bắt đầu nghe nhạc.
            </h1>
            {/* <span className="or__">or</span>
            <p className="my-4 font-bold">Sign up with your email address</p> */}
            {error && (
              <div className="mx-auto w-3/4">
                <div className="w-4/5 mx-auto pr-4 py-3 mt-4 bg-yellow-500 text-black flex items-center justify-center ">
                  <RiErrorWarningLine className="w-[50px] h-[25px] inline mr-1 text-xl" />
                  <span className=" text-sm">
                    Địa chỉ email này đã được liên kết với một tài khoản khác.
                    <br />
                    Đăng nhập với email này,
                    <Link className="underline inline mr-1" href={"/login"}>
                      Đăng nhập
                    </Link>
                  </span>
                </div>
              </div>
            )}
            <form className="text-center mx-auto w-3/4 ">
              <div className="w-4/5 mx-auto text-left py-4">
                <label
                  htmlFor="email"
                  className="font-semibold mb-2 text-sm inline-block"
                >
                  Địa chỉ email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onBlur={validateEmail}
                  onChange={(e) => {
                    if (error) {
                      setError(false);
                    }
                    if (e.target.value !== "") {
                      setValidate((prev) => ({
                        ...prev,
                        email: "",
                      }));
                    }
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value.trim(),
                    }));
                  }}
                  required
                  placeholder="name@domain.com"
                  className={`block w-full rounded-[4px] border-0  text-white transition-all duration-200 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400
                     focus:ring-[1px] focus:ring-inset  outline-none p-3 bg-transparent ${
                       validate.email && validate.email !== ""
                         ? "ring-red-500 focus:ring-red-600 "
                         : "ring-gray-300 focus:ring-white-600"
                     }`}
                />
                {validate.email && validate.email !== "" && (
                  <span className="text-sm text-red-500 flex items-center  mt-2">
                    <RiErrorWarningLine className="inline mr-2 text-red-500 text-lg" />
                    {validate.email}
                  </span>
                )}
              </div>
              <div className="w-4/5 mx-auto text-left py-2">
                <label
                  htmlFor="email"
                  className="font-semibold mb-2 text-sm inline-block"
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
                  placeholder="Nhập mật khẩu"
                  className={`block w-full rounded-[4px] border-0  text-white transition-all duration-200 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400
                     focus:ring-[1px] focus:ring-inset  outline-none p-3 bg-transparent ${
                       validate.password && validate.password !== ""
                         ? "ring-red-500 focus:ring-red-600 "
                         : "ring-gray-300 focus:ring-white-600"
                     }`}
                />
                {validate.password && validate.password !== "" && (
                  <span className="text-sm text-red-500 flex items-center  mt-2">
                    <RiErrorWarningLine className="inline mr-2 text-red-500 text-lg w-[32px]" />
                    <p className="">{validate.password}</p>
                  </span>
                )}
              </div>
              <div className="w-4/5 mx-auto text-left py-3">
                <label
                  htmlFor="name"
                  className="font-semibold  text-sm inline-block"
                >
                  Tên
                </label>
                <small className="text-gray-300 text-sm font-semibol block mb-1.5">
                  Tên này sẽ được hiển thị trên profile của bạn
                </small>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onBlur={validateName}
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setValidate((prev) => ({
                        ...prev,
                        name: "",
                      }));
                    }
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }));
                  }}
                  placeholder="Nhập tên của bạn..."
                  className={`block w-full rounded-[4px] border-0  text-white transition-all duration-200 shadow-sm ring-1 ring-inset ring-gray-400 placeholder:text-gray-400
                     focus:ring-[1px] focus:ring-inset  outline-none p-3 bg-transparent ${
                       validate.name && validate.name !== ""
                         ? "ring-red-500 focus:ring-red-600 "
                         : "ring-gray-300 focus:ring-white-600"
                     }`}
                />
                {validate.name && validate.name !== "" && (
                  <span className="text-sm text-red-500 flex items-center flex-wrap mt-2">
                    <RiErrorWarningLine className="inline mr-2 text-red-500 text-lg" />
                    {validate.name}
                  </span>
                )}
              </div>
              <div className="w-4/5 mx-auto text-left py-4">
                {/* <label
                  htmlFor="password"
                  className="font-semibold mb-2 text-sm inline-block"
                >
                  What's your date of birth?
                </label> */}
                {/* <div className="flex gap-8">
                  <div className="w-1/4">
                    <label htmlFor="password" className="ml-2 inline-block">
                      Day
                    </label>
                    <input
                      type="text"
                      id="password"
                      name="password"
                      placeholder="DD"
                      className="block w-full rounded-[4px] border-0  text-white transition-all duration-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-[3px] focus:ring-inset focus:ring-white-600 outline-none p-3 hover:ring-black bg-[#fff]"
                    />
                  </div>
                  <div className="w-2/4">
                    <label htmlFor="password" className="ml-2 inline-block">
                      Month
                    </label>
                    <select
                      type="radio"
                      id="password"
                      name="password"
                      placeholder="Password"
                      className="block w-full rounded-[4px] border-0  text-white transition-all duration-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-[3px] focus:ring-inset focus:ring-white-600 outline-none p-3 hover:ring-black bg-[#fff]"
                    >
                      {months.map((m) => {
                        return (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="w-1/4">
                    <label htmlFor="password" className="ml-2 inline-block">
                      Year
                    </label>
                    <input
                      type="text"
                      id="password"
                      name="password"
                      placeholder="YYYY"
                      className="block w-full rounded-[4px] border-0  text-white transition-all duration-200 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-[3px] focus:ring-inset focus:ring-white-600 outline-none p-3 hover:ring-black bg-[#fff]"
                    />
                  </div>
                </div> */}
                <p className="mb-2 font-semibold text-sm inline-block">
                  Giới tính:
                </p>
                <div className="flex gap-8 ">
                  <div className="">
                    <input
                      type="radio"
                      id="male"
                      name="gender"
                      placeholder="gender"
                      checked={formData.gender === "male"}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          gender: "male",
                        }));
                      }}
                    />
                    <label htmlFor="gender" className="ml-2 inline-block">
                      Nam
                    </label>
                  </div>
                  <div className="">
                    <input
                      type="radio"
                      id="femail"
                      name="gender"
                      checked={formData.gender === "female"}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          gender: "female",
                        }));
                      }}
                      placeholder="gender"
                      className=""
                    />
                    <label htmlFor="gender" className="ml-2 inline-block">
                      Nữ
                    </label>
                  </div>
                  <div className="">
                    <input
                      type="radio"
                      id="others"
                      name="gender"
                      placeholder="gender"
                      className=""
                      checked={formData.gender === "others"}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          gender: "others",
                        }));
                      }}
                    />
                    <label htmlFor="gender" className="ml-2 inline-block">
                      Khác
                    </label>
                  </div>
                </div>
                {/* {validate.gender && validate.gender !== "" && (
                  <span className="text-sm text-red-500 flex items-center flex-wrap mt-2">
                    <RiErrorWarningLine className="inline mr-2 text-red-500 text-lg" />
                    {validate.gender}
                  </span>
                )} */}
              </div>

              <div className="py-3 w-4/5 mx-auto">
                <button
                  className="py-3 block cursor-pointer w-full outline-none bg-green-400 text-black p-3 hover:scale-105 translate-all duration-200  font-semibold text-center rounded-full"
                  onClick={handleSubmit}
                >
                  Đăng ký
                </button>
              </div>
            </form>
            <div className="w-3/4 mx-auto py-3">
              <div className="relative mx-auto my-3 w-4/5 border-b border-gray-300">
                <span className="px-5 absolute -top-[12px] right-[50%] translate-x-[50%] bg-secondaryBg text-white">
                  hoặc
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-center justify-center w-3/4 mx-auto">
              <div
                className="flex items-center justify-center w-4/5  gap-2 px-10 py-3 border border-gray-600 hover:border-white my-2 rounded-full font-semibold cursor-pointer duration-100 ease-in-out transition-all"
                onClick={loginWithGoogle}
              >
                <FcGoogle className="text-xl  inline-block" />

                <span className="text-left ">Tiếp tục bằng Google</span>
              </div>
              <div
                className=" flex items-center justify-center w-4/5 gap-2 px-10 py-3 border border-gray-600 hover:border-white my-2 rounded-full font-semibold cursor-pointer duration-100 ease-in-out transition-all"
                // onClick={loginWithGoogle}
              >
                <FaFacebook className="text-xl text-center  inline-block" />

                <span className="text-center ">Tiếp tục bằng Facebook</span>
              </div>
              <div
                className="flex items-center justify-center w-4/5  gap-2 px-10 py-3 border border-gray-600 hover:border-white my-2 rounded-full font-semibold cursor-pointer duration-100 ease-in-out transition-all"
                // onClick={loginWithGoogle}
              >
                <FaGithub className="text-center  text-xl  inline-block" />
                <span className="text-center  ">Tiếp tục bằng Github</span>
              </div>
            </div>
            <div className="pt-8 ">
              <span className="text-gray-300 font-semibold">
                Bạn đã có tài khoản?{" "}
              </span>

              <Link
                href="/login"
                className="text-white hover:text-green-400/90 font-semibold underline mx-auto"
              >
                Đăng nhập tại đây
              </Link>
            </div>
            {/* <button
              onClick={() => {
                toast.success("Ok");
              }}
            >
              Click me!
            </button> */}
            <div className="relative z-10000">
              <ToastContainer
                draggablePercent={60}
                autoClose={5000}
                limit={2}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
