"use client";
import { useRouter } from "next/navigation";
import { debounce } from "../../utils/helperFuncs";
import "./signup.css";
const Signup = () => {
  const router = useRouter();
  const handleChangeRouter = () => {
    router.push("/signup");
  };
  return (
    <div className="fixed bottom-0 right-0 -left-2 signup_bar text-sm items-center flex px-4 py-4  justify-between">
      <div>
        <p className=" uppercase">preview on spotify</p>
        <p className="font-bold">
          Đăng ký để tận hưởng kho âm nhạc đồ sộ của chúng tôi
        </p>
      </div>
      <button
        onClick={() => handleChangeRouter()}
        className="hover:scale-105 transition-all duration-150 ease-out rounded-full text-black  px-8 text-lg  py-2 bg-white font-semibold"
      >
        Đăng ký miễn phí
      </button>
    </div>
  );
};

export default Signup;
