import React, { useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";

function SearchLibrary({ category }) {
  const iconRef = useRef();
  const inputRef = useRef();
  const [openInput, setOpenInput] = useState(false);
  const openSearchInput = () => {
    setOpenInput(true);
    inputRef.current.focus();
  };
  return (
    <div className="pl-1 pr-2  ">
      <div
        className={`relative  h-[35x] ${
          openInput
            ? "block w-fit rounded-md bg-[#232323]"
            : "inline h-[35x] bg-transparent hover:bg-[#232323] py-2 rounded-full "
        } `}
      >
        <div
          // htmlFor="input"
          className={` mt-4 inline  cursor-pointer transition-all ease-out duration-150 w-[20px]  rounded-full ${
            openInput && "pointer-events-none"
          } `}
          onClick={() => openSearchInput()}
        >
          <i className="inline">
            <FiSearch
              className="inline  mx-2 text-secondaryText font-bold text-lg "
              // onClick={openSearchInput}
              ref={iconRef}
            />
          </i>
        </div>

        <input
          id="input"
          ref={inputRef}
          type="text"
          placeholder={`Tìm kiếm ${category === "song" ? "bài hát" : category}`}
          className={` text-secondaryText inline rounded-md outline-none  text-sm w-0 bg-transparent ${
            openInput ? "w-[180px]" : "w-0"
          }  py-2 `}
          onFocus={(e) => {
            setOpenInput(true);
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              setOpenInput(false);
            }
          }}
        />
      </div>
    </div>
  );
}
export default SearchLibrary;
