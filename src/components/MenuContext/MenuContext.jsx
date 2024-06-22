import React from "react";
import { PiQueueBold } from "react-icons/pi";
import { FiEdit2, FiPlusCircle } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdAddCircleOutline } from "react-icons/md";
export const playlistMenu = [
  {
    id: 1,
    title: "Thêm vào hàng đợi",
    icon: <PiQueueBold className="text-[16px] text-secondaryText" />,
  },
  {
    id: 2,
    title: "Chỉnh sửa chi tiết",
    icon: <FiEdit2 className="text-md text-secondaryText" />,
  },
  {
    id: 3,
    title: "Xoá playlist",
    icon: <IoMdCloseCircleOutline className="text-lg text-secondaryText" />,
  },
  {
    id: 4,
    title: "Tạo mới playlist",
    icon: <FiPlusCircle className="text-[16px] text-secondaryText" />,
  },
];
export default function ({ type, top, left }) {
  return (
    <div
      className={`absolute bg-[#282828] rounded-md top-[${top}px] left-[${left}px]`}
    >
      {type === "album" && (
        <>
          {playlistMenu.map((item, index) => {
            const lastIndex = playlistMenu.length - 1;
            return (
              <div
                key={index}
                className={`min-w-[190px]  w-full flex items-center ${
                  index === 0 && "mt-1"
                } ${
                  index === lastIndex && "mb-1"
                } text-sm p-2.5    gap-3 bg-[#282828] hover:bg-[#323232] `}
              >
                <div>{item.icon}</div>
                <p>{item.title}</p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
