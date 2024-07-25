"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

function Dropdown(props) {
  const { noti, setNoti, item, listValue, formData, setFormData } = props;
  const boxRef = useRef(null);
  const [value, setValue] = useState(() => {
    if (item === "language") return "Chọn ngôn ngữ";
    if (item === "album") return "Chọn album";
  });

  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const chooseItem = (data) => {
    if (item === "language") {
      setFormData((prev) => {
        return { ...prev, [item]: data.name };
      });
    }
    setNoti((prev) => {
      const tmp = [...noti];
      let newNoti = tmp.filter((note) => noti !== item);
      return newNoti;
    });

    setValue(data.name);
    // setIsOpenDropdown(false);
  };

  const handleClickOutside = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setIsOpenDropdown(false);
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
      className={`cursor-pointer  block relative w-full my-1 py-2 px-3 text-sm border ${
        noti.includes("language")
          ? "border-red-500 hover:border-red-500"
          : "border-gray-600  hover:border-secondaryText focus:border-secondaryText "
      }  bg-[#3e3e3e] outline-none text-white   rounded-md`}
      onClick={() => setIsOpenDropdown(!isOpenDropdown)}
      ref={boxRef}
    >
      {/* Filter name  */}
      <p className="flex justify-between  text-white  items-center gap-6">
        {/* {filterName.length > 15 ? `${filterName.slice(0, 15)}...` : filterName} */}
        {value}
        <IoChevronDown className={`text-base text-secondaryText `} />
      </p>

      {/* Dropdown  */}
      {listValue && isOpenDropdown && (
        <div className="  z-50  max-h-28  overflow-y-auto scrollbar-thin  scrollbar-thumb-gray-400  flex flex-col rouned-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] absolute top-[calc(100%+4px)] left-0 right-0 rounded-md">
          {listValue?.map((item, index) => {
            const lastIndex = listValue.length - 1;
            return (
              <div
                key={index}
                className={`${
                  index === lastIndex && "rounded-b-md"
                }flex  max-h-10 items-center gap-2 px-4 py-2  bg-[#3e3e3e] hover:bg-hoverBGLight`}
                onClick={() => chooseItem(item)}
              >
                <p className="w-full text-white">
                  {item.name.length > 40
                    ? `${item.name.slice(0, 40)}...`
                    : item.name}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default Dropdown;
