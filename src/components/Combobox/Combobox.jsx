"use client";
import React, { useState, useRef, useEffect } from "react";
import { MenuProps } from "../MenuProps";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa";
export default function ComboBox({
  children,
  menu,
  label,
  selectedOption,
  className,
  width,
  ...props
}) {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const comboBoxRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  const handleClickOutside = (event) => {
    if (comboBoxRef.current && !comboBoxRef.current.contains(event.target)) {
      setIsOpenDropdown(false);
    }
  };
  useEffect(() => {
    toggleDropdown();
  }, [selectedOption]);
  useEffect(() => {
    setIsOpenDropdown(false);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={comboBoxRef}>
      <div className={`${width} relative inline-block  text-left`}>
        <div className=" flex flex-nowrap items-center ">
          <h3 className="inline-block text-textColor dark:text-gray-50 text-sm">
            {label}
          </h3>
          <div
            className={` ${className} w-full flex gap-2  items-center justify-between px-4 py-2 h-10 rounded-[4px]  min-w-32 border border-gray-300 cursor-pointer text-sm `}
            onClick={toggleDropdown}
          >
            {selectedOption}
            {isOpenDropdown ? <FaAngleUp /> : <FaAngleDown />}
          </div>
        </div>
        <div
          className={`${
            isOpenDropdown ? "" : "hidden"
          }  ${width} absolute right-0 z-10 mt-2 min-w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none  max-h-[112px] overflow-y-scroll`}
        >
          {menu.map((item) => (
            <div
              className="  rounded hover:bg-gray-200 cursor-pointer"
              key={item.key}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
