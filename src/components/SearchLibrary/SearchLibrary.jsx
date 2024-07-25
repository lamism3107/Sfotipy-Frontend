import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import * as libraryServices from "../../services/library.api";
import {
  fetchLibraryDataFailure,
  fetchLibraryDataStart,
  fetchLibraryDataSuccess,
} from "../../redux/slice/library.slice";
import useSWR, { mutate } from "swr";

function SearchLibrary({
  searchValue,
  setSearchValue,
  setIsFoundSearchData,
  setFoundListData,
}) {
  const dispatch = useDispatch();
  const iconRef = useRef();
  const inputRef = useRef();
  const reduxCurrentCategory = useSelector(
    (state) => state.library.currentCategory
  );
  const reduxCurrentSort = useSelector((state) => state.library.currentSort);
  const [openInput, setOpenInput] = useState(false);

  const {
    data: libraryData,
    isLoading: isLoadingLibraryData,
    mutate: mutateLibraryData,
  } = useSWR(
    `/library/?category=${reduxCurrentCategory}`,
    () => libraryServices.getLibraryData(reduxCurrentCategory),
    {
      dedupingInterval: 3000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

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
    if (reduxCurrentCategory === "Artist") {
      return "Tìm kiếm nghệ sĩ";
    }
  };

  //   `/library/?category=${reduxCurrentCategory}`,
  //   () => libraryServices.getLibraryData(reduxCurrentCategory),
  //   {
  //     //Loại bỏ các request trùng lặp có cùng key trong khoảng 5s
  //     revalidateOnFocus: false,
  //     revalidateOnMount: false,
  //     // revalidateEvents: false,
  //     revalidateIfStale: true,
  //     onError: (...args) => {
  //       dispatch(fetchMyAlbumsFailure());
  //     },
  //     onSuccess: (libraryData) => {
  //       console.log("success");
  //       dispatch(
  //         fetchLibraryDataSuccess({
  //           libraryData: libraryData.libraryData,
  //           categoryList: libraryData.categoryList,
  //         })
  //       );
  //     },
  //   }
  // );

  // const getLibaryData = async () => {
  //   const res = await libraryServices.getLibraryData(reduxCurrentCategory);
  //   if (res?.success) {
  //     dispatch(
  //       fetchLibraryDataSuccess({
  //         libraryData: res.data.libraryData,
  //         categoryList: res.data.categoryList,
  //       })
  //     );
  //   } else {
  //     dispatch(fetchLibraryDataFailure());
  //   }
  // };
  //Search Item By Name
  const searchItemByName = async (name) => {
    if (name !== "") {
      let sortBy = reduxCurrentSort.sortBy;
      let sort = reduxCurrentSort.sort;
      let categoryURL = "";
      if (reduxCurrentCategory !== "All") {
        categoryURL = `${reduxCurrentCategory.toLowerCase()}s`;
      } else {
        categoryURL = "all";
      }
      const listData = await libraryServices.searchItemByName(
        categoryURL,
        name,
        sort,
        sortBy
      );

      if (listData && listData.success) {
        if (listData.data.length > 0) {
          console.log(listData.data);
          setIsFoundSearchData(true);
          setFoundListData(listData.data);
        } else {
          setIsFoundSearchData(false);
          setFoundListData([]);
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
      if (e.target.value !== "") {
        searchItemByName(e.target.value);
      } else {
        // mutate(`/library/?category=${reduxCurrentCategory}`);
        setIsFoundSearchData(true);
      }
    }, 500);
  };
  useEffect(() => {
    console.log("hello");
    searchItemByName(searchValue);
  }, [reduxCurrentSort]);
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
