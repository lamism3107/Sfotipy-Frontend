import React, { useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as libraryServices from "../../services/libraryServices";
import {
  fetchLibraryDataFailure,
  fetchLibraryDataStart,
  fetchLibraryDataSuccess,
} from "../../redux/slice/library.slice";

function SearchList({ searchValue, setSearchValue }) {
  const reduxCurrentCategory = useSelector(
    (state) => state.library.category.currentCategory
  );

  const typingTimeoutRef = useRef(null);

  const getLibaryData = async () => {
    dispatch(fetchLibraryDataStart());
    const res = await libraryServices.getLibraryData(
      reduxCurrentCategory,
      "-createdAt"
    );
    if (res?.success) {
      let libraryData = res.data.libraryData;
      let categoryList = res.data.categoryList;
      dispatch(
        fetchLibraryDataSuccess({
          libraryData: libraryData,
          categoryList: categoryList,
        })
      );
    } else {
      dispatch(fetchLibraryDataFailure());
    }
  };
  const handleSearchInLibrary = (e) => {
    setSearchValue(e.target.value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      console.log("helllo");
    }, 1000);
  };
  return (
    <div
      className={`relative w-1/2 flex h-[35x] 
             py-2 rounded-sm flex-1
        } `}
    >
      <div className="w-full rounded-[4px] bg-[#2c2c2c]">
        <label
          htmlFor="input2"
          className={`  absolute mt-1 cursor-pointer transition-all ease-out duration-150 w-[20px]  rounded-full 
           `}
        >
          <FiSearch className="inline search-list  mx-2 text-secondaryText font-bold text-lg " />
        </label>

        <input
          id="input2"
          type="text"
          value={searchValue}
          setSearchValue={searchValue}
          placeholder={"Tìm kiếm bài hát"}
          className={` text-[#bfbfbf] rounded-md outline-none pl-8  text-md   bg-[#2c2c2c] w-full 
            py-2 `}
          onFocus={(e) => {
            // setOpenInput(true);
          }}
          onBlur={(e) => {
            if (e.target.value === "") {
              // setOpenInput(false);
            }
          }}
          onChange={(e) => {
            handleSearchInLibrary(e);
          }}
        />
      </div>
    </div>
  );
}
export default SearchList;
