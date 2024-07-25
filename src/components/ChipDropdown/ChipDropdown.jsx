"use client";
import React, { useEffect, useRef, useState } from "react";
import Chip from "../Chips/Chip";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

function ChipDropdown({ item, formData, setFormData, dropdownList }) {
  const listChips = useRef(null);
  const [listValue, setListValue] = useState([]);
  const handleDeleteChips = (index) => {
    const newKeywords = [...listValue];
    newKeywords.splice(index, 1);
    setListValue(newKeywords);
  };
  const box2Ref = useRef(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const chooseItem = (data) => {
    setIsOpenDropdown(false);
    const foundGenre = listValue.findIndex((item) => item.name === data.name);
    if (foundGenre === -1) {
      setListValue((prev) => [...prev, data]);
      setFormData((prev) => ({
        ...prev,
        [item]: [...prev[item], data._id],
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (box2Ref.current && !box2Ref.current.contains(event.target)) {
        setIsOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {listValue.length > 0 && (
        <div ref={listChips} className=" flex flex-wrap gap-1.5 my-1.5 w-fit">
          {listValue?.map((item, index) => {
            return (
              <Chip
                disabled={false}
                content={item.name}
                onRemove={() => handleDeleteChips(index)}
              />
            );
          })}
        </div>
      )}

      <div
        ref={box2Ref}
        className="cursor-pointer  block relative w-full my-1 py-2 px-3 text-sm border border-gray-600 focus:border-secondaryText hover:border-secondaryText  bg-[#3e3e3e] outline-none text-white   rounded-md"
        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
      >
        {/* Filter name  */}
        <p className="flex justify-between  text-white  items-center gap-6">
          {/* {filterName.length > 15 ? `${filterName.slice(0, 15)}...` : filterName} */}
          Chọn thể loại
          <IoChevronDown className={`text-base text-secondaryText `} />
        </p>

        {/* Dropdown  */}
        {dropdownList && isOpenDropdown && (
          <div
            // ref={boxRef}
            className="  z-50  max-h-28  overflow-y-auto scrollbar-thin  scrollbar-thumb-gray-400  flex flex-col rouned-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] absolute top-[calc(100%+4px)] left-0 right-0 rounded-md"
          >
            {dropdownList?.map((item, index) => {
              const lastIndex = dropdownList.length - 1;
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
    </>
  );
}

export default ChipDropdown;
