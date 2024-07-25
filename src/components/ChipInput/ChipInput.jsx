"use client";
import React, { useEffect, useRef, useState } from "react";
import Chip from "../Chips/Chip";
import { useSelector } from "react-redux";

function ChipInput(props) {
  const {
    item,
    formData,
    setFormData,
    dropdownList,
    setDropdownList,
    handleSearch,
    isFoundData,
    placeholder,
    setIsFoundData,
  } = props;
  const listChips = useRef(null);
  const boxRef = useRef(null);
  const user = useSelector((state) => state.auth.login.currentUser);
  const [inputValue, setInputValue] = useState("");
  const [chipList, setChipList] = useState(() => {
    if (item === "artists" && user) return [user.name];
    else return [];
  });
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const handleDeleteChips = (index) => {
    let newChipList = [...chipList];
    newChipList.splice(index, 1);
    setChipList(newChipList);

    let newFormDataList = [...formData[item]];
    newFormDataList.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      [item]: newFormDataList,
    }));
  };

  const chooseItem = (data) => {
    setIsOpenDropdown(false);
    setInputValue("");
    setFormData((prev) => ({
      ...prev,
      [item]: [...prev[item], data._id],
    }));
    setChipList((prev) => [...prev, data.name]);
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
      className={`flex my-1 flex-wrap items-center gap-2 bg-[#3e3e3e] border border-gray-600 relative rounded-md w-full py-2 px-2  focus:border-secondaryText"`}
    >
      {chipList.length > 0 && (
        <div ref={listChips} className="flex flex-wrap gap-1.5  w-fit">
          {chipList?.map((artistName, index) => {
            return (
              <>
                {item === "artists" ? (
                  index === 0 ? (
                    <Chip
                      disabled={true}
                      content={artistName}
                      onRemove={() => handleDeleteChips(index)}
                    />
                  ) : (
                    <Chip
                      disabled={false}
                      content={artistName}
                      onRemove={() => handleDeleteChips(index)}
                    />
                  )
                ) : (
                  <Chip
                    disabled={false}
                    content={artistName}
                    onRemove={() => handleDeleteChips(index)}
                  />
                )}
              </>
            );
          })}
        </div>
      )}
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          handleSearch(e.target.value);
          if (e.target.value !== "") setIsOpenDropdown(true);
          else {
            setDropdownList([]);
            setIsOpenDropdown(false);
          }
        }}
        onBlur={() => {
          setInputValue("");
        }}
        type="text"
        id={item}
        className={`flex-1   text-sm   outline-none bg-transparent text-white `}
        placeholder={placeholder}
        required
      />
      {/* Dropdown  */}
      {isFoundData && isOpenDropdown && (
        <div
          ref={boxRef}
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
                <p className="w-full text-sm t text-white">
                  {item.name.length > 40
                    ? `${item.name.slice(0, 40)}...`
                    : item.name}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {!isFoundData && isOpenDropdown && (
        <div
          ref={boxRef}
          className="  z-50  max-h-28  overflow-y-auto scrollbar-thin  scrollbar-thumb-gray-400  flex flex-col rouned-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] absolute top-[calc(100%+4px)] left-0 right-0 rounded-md"
        >
          <div
            className={` flex  max-h-10 items-center gap-2 px-4 py-2  bg-[#3e3e3e]`}
          >
            <p className="w-full text-sm text-secondaryText">
              Không tìm thấy kết quả phù hợp
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChipInput;
