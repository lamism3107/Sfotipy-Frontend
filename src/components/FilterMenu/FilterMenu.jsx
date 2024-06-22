"use client";
import React, { useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";

const list = ["Thêm gần đây", "Thêm lâu nhất", "Bảng chữ cái"];
function FilterMenu({
  buttonFilterRef,
  isOpen,
  setIsOpen,
  filterOpt,
  setFilterOpt,
}) {
  const boxRef = useRef(null);

  const handleSelect = (filter) => {
    setFilterOpt(filter);
    setIsOpen({
      add: false,
      filter: false,
    });
  };
  const handleClickOutside = (event) => {
    if (
      boxRef.current &&
      !buttonFilterRef.current.contains(event.target) &&
      !boxRef.current.contains(event.target)
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

  console.log("check open", isOpen);
  return (
    <div
      className="bg-[#252525] z-100  w-fit add-menu  absolute top-[calc(100%+8px)] right-0 rounded-md drop-shadow-lg"
      ref={boxRef}
    >
      <span className="text-xs block text-secondaryText pt-2 pb-1 ">
        Sắp xếp theo
      </span>
      {list.map((item) => (
        <div
          className={`min-w-[160px]  w-full flex items-center justify-between mb-1 text-sm font-semibold p-2.5  gap-3 bg-transparent hover:bg-[#323232] ${
            filterOpt === item ? "text-green-400" : "text-white"
          } `}
          onClick={() => handleSelect(item)}
        >
          <span className="block">{item}</span>
          {filterOpt === item && <FaCheck className="text-green-400 text-md" />}
        </div>
      ))}
    </div>
  );
}
export default FilterMenu;
