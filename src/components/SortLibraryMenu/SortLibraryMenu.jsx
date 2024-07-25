"use client";
import React, { useEffect, useRef } from "react";
import { FaCheck } from "react-icons/fa";
import {
  fetchLibraryDataFailure,
  fetchLibraryDataStart,
  fetchLibraryDataSuccess,
  setCurrentSort,
} from "../../redux/slice/library.slice";
import * as libraryServices from "../../services/library.api";
import { useDispatch, useSelector } from "react-redux";
import useSWR, { mutate } from "swr";

const sortOptList = [
  {
    title: "Thêm gần đây",
    sortBy: "createdAt",
    sort: "desc",
  },
  {
    title: "Thêm lâu nhất",
    sortBy: "createdAt",
    sort: "asc",
  },
  {
    title: "Bảng chữ cái",
    sortBy: "name",
    sort: "asc",
  },
];
function SortLibraryMenu({
  libraryData,
  mutateLibraryData,
  buttonFilterRef,
  isOpen,
  setIsOpen,
}) {
  const sortBoxRef = useRef(null);
  const dispatch = useDispatch();

  const reduxCurrentCategory = useSelector(
    (state) => state.library.currentCategory
  );
  const reduxCurrentSort = useSelector((state) => state.library.currentSort);

  const handleSelect = async (filter, sortBy, sort) => {
    const res = await mutate(
      `/library/?category=${reduxCurrentCategory}`,
      (libraryData) => {
        let sortData = [];

        if (sortBy === "createdAt" && sort === "desc") {
          sortData = [...libraryData.libraryData]?.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        }
        if (sortBy === "createdAt" && sort === "asc") {
          sortData = [...libraryData.libraryData]?.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        }
        if (sortBy === "name" && sort === "asc") {
          sortData = [...libraryData.libraryData]?.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        }
        // libraryData.libraryData = sortData;
        libraryData = { ...libraryData, libraryData: sortData };
        return libraryData;
      },
      false
    );
    dispatch(
      setCurrentSort({
        title: filter,
        sortBy: sortBy,
        sort: sort,
      })
    );
    setIsOpen((prev) => {
      console.log("close");
      return {
        add: false,
        filter: false,
      };
    });
  };

  const handleClickOutside = (event) => {
    if (!buttonFilterRef.current.contains(event.target)) {
      setIsOpen((prev) => ({
        add: false,
        filter: false,
      }));
    }
    if (sortBoxRef.current && !sortBoxRef.current.contains(event.target)) {
      setIsOpen((prev) => {
        console.log("close CLickoutside");
        return {
          add: false,
          filter: false,
        };
      });
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
      className="bg-[#252525] z-100  w-fit add-menu  absolute top-[calc(100%+8px)] right-0 rounded-md drop-shadow-lg"
      ref={sortBoxRef}
    >
      <span className="text-xs block text-secondaryText pt-2 pb-1 ">
        Sắp xếp theo
      </span>
      {sortOptList.map((item, index) => {
        return (
          <div
            key={index}
            className={`min-w-[160px] ${index === 0 && "mt-1"} ${
              index === sortOptList.length - 1 && "rounded-b-md"
            }  w-full flex items-center justify-between  text-sm font-semibold p-2.5  gap-3 bg-transparent hover:bg-[#323232] ${
              reduxCurrentSort.title === item.title
                ? "text-green-400"
                : "text-white"
            } `}
            onClick={() => handleSelect(item.title, item.sortBy, item.sort)}
          >
            <span className="block">{item.title}</span>
            {reduxCurrentSort.title === item.title && (
              <FaCheck className="text-green-400 text-md" />
            )}
          </div>
        );
      })}
    </div>
  );
}
export default SortLibraryMenu;
