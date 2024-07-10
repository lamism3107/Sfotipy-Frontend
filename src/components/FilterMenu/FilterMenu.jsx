"use client";
import React, { useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import {
  fetchLibraryDataFailure,
  fetchLibraryDataStart,
  fetchLibraryDataSuccess,
} from "../../redux/slice/library.slice";
import * as libraryServices from "../../services/libraryServices";
import { useDispatch, useSelector } from "react-redux";

const filterOptList = [
  {
    title: "Thêm gần đây",
    query: "-createdAt",
  },
  {
    title: "Thêm lâu nhất",
    query: "createdAt",
  },
  {
    title: "Bảng chữ cái",
    query: "alphabet",
  },
  {
    title: "Được tạo bởi bạn",
    query: "yours",
  },
];
function FilterMenu({
  buttonFilterRef,
  isOpen,
  setIsOpen,
  filterOpt,
  setFilterOpt,
}) {
  const boxRef = useRef(null);
  const dispatch = useDispatch();
  const reduxCurrentCategory = useSelector(
    (state) => state.library.category.currentCategory
  );

  const getLibraryData = async (filter) => {
    dispatch(fetchLibraryDataStart());
    const res = await libraryServices.getLibraryData(
      reduxCurrentCategory,
      filter
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
  // if (reduxCurrentCategory !== "All") {

  const handleSelect = (filter, query) => {
    getLibraryData(query);

    setFilterOpt({
      title: filter,
      query: query,
    });
    setIsOpen({
      add: false,
      filter: false,
    });
  };
  const handleClickOutside = (event) => {
    if (!buttonFilterRef.current.contains(event.target)) {
      setIsOpen((prev) => ({
        add: false,
        filter: false,
      }));
    }
    // if (boxRef.current && !boxRef.current.contains(event.target)) {
    //   setIsOpen((prev) => ({
    //     add: false,
    //     filter: false,
    //   }));
    // }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("filterOpt", filterOptList);
  return (
    <div
      className="bg-[#252525] z-100  w-fit add-menu  absolute top-[calc(100%+8px)] right-0 rounded-md drop-shadow-lg"
      ref={boxRef}
    >
      <span className="text-xs block text-secondaryText pt-2 pb-1 ">
        Sắp xếp theo
      </span>
      {filterOptList.map((item, index) => {
        return (
          <div
            key={index}
            className={`min-w-[160px] ${index === 0 && "mt-1"} ${
              index === filterOptList.length - 1 && "rounded-b-md"
            }  w-full flex items-center justify-between  text-sm font-semibold p-2.5  gap-3 bg-transparent hover:bg-[#323232] ${
              filterOpt === item.title ? "text-green-400" : "text-white"
            } `}
            onClick={() => handleSelect(item.title, item.query)}
          >
            <span className="block">{item.title}</span>
            {filterOpt === item.title && (
              <FaCheck className="text-green-400 text-md" />
            )}
          </div>
        );
      })}
    </div>
  );
}
export default FilterMenu;
