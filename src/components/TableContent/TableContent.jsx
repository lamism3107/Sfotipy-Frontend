import Image from "next/image";
import React from "react";
import { LuClock3 } from "react-icons/lu";
export default function TableContent() {
  return (
    <div className="relative overflow-x-auto shadow-md ">
      <table className="w-full text-sm  text-left ">
        <thead className="text-[14px]  items-center w-full  text-secondaryText bg-transparent border-b border-[#575757]">
          <tr className="flex w-full">
            <th className="text-md text-center px-3 py-3 w-7">#</th>
            <th className="grow-[4] px-2 py-3">Tên</th>
            <th className="grow-[3] px-2 py-3">Album</th>
            <th className="grow-[1] px-2 py-3">Ngày thêm</th>
            <th className="grow-[1] px-2 py-3 text-center">
              <LuClock3 className="text-xl" />
            </th>
          </tr>
        </thead>
        <tbody className="text-secondaryText  mt-2 ">
          <tr className="bg-transparent rounded-[4px] overflow-hidden text-[14px] w-full hover:bg-[#393939] hover:text-white">
            <td className="text-md text-center px-3 py-3 w-7">1</td>
            <td className=" grow-[4] px-2 py-3">
              <div className="cursor-pointer flex-grow  rounded-md  gap-3.5 flex item-center justify-start ">
                <div className="w-[44px] h-[44px]">
                  <Image
                    width={50}
                    height={50}
                    className="object-cover  h-full rounded-md"
                    src={
                      // item.thumbnail === ""
                      "https://firebasestorage.googleapis.com/v0/b/spotify-clone-350f3.appspot.com/o/playlistDefault.png?alt=media&token=99a06d44-2dee-412e-b659-695b591af95c"
                      // : item.thumbnail
                    }
                  />
                </div>
                <div className="flex flex-col  my-1 flex-1">
                  <p className="text-white "> Nikes</p>
                  <div className="flex items-center  ">
                    <p className="text-sm text-secondaryText ">Lam tran</p>
                  </div>
                </div>
              </div>
            </td>
            <td className="grow-[3] px-2 py-3">Laptop</td>
            <td className="grow-[1] px-2 py-3">$2999</td>
            <td className="grow-[1] px-2 py-3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
