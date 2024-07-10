import React from "react";

function PillTag({ content, active }) {
  return (
    <div
      className={`w-fit   transition-all ease-out duration-150  px-3 py-2  rounded-full  text-sm font-semibold cursor-pointer ${
        active
          ? "bg-white text-black"
          : "bg-[#232323] text-white hover:text-white hover:bg-[#2a2a2a] "
      }`}
    >
      {(function () {
        if (content === "Playlist") return "Playlists";
        if (content === "Album") return "Albums";
        if (content === "Artits") return "Artists";
        if (content === "Song") return "Songs";
      })()}
    </div>
  );
}
export default PillTag;
