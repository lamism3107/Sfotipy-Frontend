import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import * as libraryServices from "../../services/libraryServices";
import {
  fetchLibraryDataFailure,
  fetchLibraryDataStart,
  fetchLibraryDataSuccess,
} from "../../redux/slice/library.slice";

function SearchLibrary({
  filterOpt,
  searchValue,
  setSearchValue,
  setIsFoundSearchData,
}) {
  const dispatch = useDispatch();
  const iconRef = useRef();
  const inputRef = useRef();
  const reduxCurrentCategory = useSelector(
    (state) => state.library.category.currentCategory
  );
  const reduxCategoryList = useSelector(
    (state) => state.library.category.categoryList
  );
  const [openInput, setOpenInput] = useState(false);
  const openSearchInput = () => {
    setOpenInput(true);
    inputRef.current.focus();
  };
  const typingTimeoutRef = useRef(null);
  useEffect(() => {
    setSearchValue("");
  }, [reduxCurrentCategory]);

  const setPlaceholder = () => {
    if (reduxCurrentCategory === "All") {
      return "Tìm kiếm trong thư viện";
    }
    if (reduxCurrentCategory === "Song") {
      return "Tìm kiếm bài hát";
    }
    if (reduxCurrentCategory === "Album") {
      return "Tìm kiếm album";
    }
    if (reduxCurrentCategory === "Playlist") {
      return "Tìm kiếm playlist";
    }
  };

  const getLibaryData = async () => {
    dispatch(fetchLibraryDataStart());
    const res = await libraryServices.getLibraryData(
      reduxCurrentCategory,
      filterOpt
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
  //Search Item By Name
  const searchItemByName = async (name) => {
    console.log("reduxCurrentCategory", reduxCurrentCategory);
    if (searchValue !== "") {
      const listData = await libraryServices.searchItemByName(
        reduxCurrentCategory,
        name
      );
      if (listData && listData.success) {
        if (listData.data.length > 0) {
          setIsFoundSearchData(true);
          dispatch(
            fetchLibraryDataSuccess({
              libraryData: listData.data,
              categoryList: reduxCategoryList,
            })
          );
        } else {
          setIsFoundSearchData(false);
        }
      }
    }
  };
  const handleSearchInLibrary = (e) => {
    setSearchValue(e.target.value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      console.log("searchValue", e.target.value);
      if (e.target.value !== "") {
        searchItemByName(e.target.value);
      } else {
        getLibaryData();
      }
    }, 1000);
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
          value={searchValue}
          setSearchValue={searchValue}
          placeholder={setPlaceholder()}
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
          onChange={(e) => {
            handleSearchInLibrary(e);
          }}
        />
      </div>
    </div>
  );
}
export default SearchLibrary;
