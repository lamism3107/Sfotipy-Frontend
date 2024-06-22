import React from "react";

function PillTag({ content, active }) {
  return (
    <div
      className={`w-fit inline  transition-all ease-out duration-150  px-3 py-2  rounded-full  text-sm font-semibold cursor-pointer ${
        active
          ? "bg-white text-black"
          : "bg-[#232323] text-white hover:text-white hover:bg-[#2a2a2a]"
      }`}
    >
      {content}
    </div>
  );
}
export default PillTag;
