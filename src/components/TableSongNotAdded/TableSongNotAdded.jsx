import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
const tableSongHoverClick = ["albumSongs", "notAddedSongs"];

export default function ({
  songsNotAdded,
  setSongHovered,
  setSongClicked,
  songClicked,
}) {
  const songNotAddedRef = useRef();
  const handleClickOutsideAlbumSong = (event) => {
    if (
      songNotAddedRef.current &&
      !songNotAddedRef.current.contains(event.target)
    ) {
      setSongClicked((prev) => {
        let newType = [...prev.type];
        newType = newType.filter((t) => t !== tableSongHoverClick[1]);
        return {
          type: newType,
          songIndex: -1,
        };
      });
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideAlbumSong);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideAlbumSong);
    };
  }, []);
  return (
    <div>
      <div className="mt-3.5">
        {songsNotAdded?.map((item, index) => {
          return (
            <div
              ref={songNotAddedRef}
              className={`${
                songClicked.type.includes(tableSongHoverClick[1]) &&
                songClicked.songIndex === index
                  ? "bg-[#5e5e5f] text-white"
                  : "hover:bg-[#393939] hover:text-white text-secondaryText bg-transparent"
              } flex h-14 items-center w-full rounded-[4px] overflow-x-auto text-[14px]  pl-2 `}
              onClick={() => {
                setSongClicked((prev) => {
                  let newType = [...prev.type];
                  if (!prev.type.includes(tableSongHoverClick[1])) {
                    newType = [...prev.type, tableSongHoverClick[1]];
                  }
                  return {
                    type: newType,
                    songIndex: index,
                  };
                });
              }}
              onMouseEnter={() =>
                setSongHovered({
                  type: tableSongHoverClick[1],
                  songIndex: index,
                })
              }
              onMouseLeave={() =>
                setSongHovered({
                  type: "",
                  songIndex: -1,
                })
              }
            >
              <div className="w-5/12  text-left">
                <div className="cursor-pointer  rounded-[4px]  gap-3.5 flex item-center justify-start ">
                  <div className="w-[40px] h-[40px]">
                    <Image
                      width={50}
                      height={50}
                      alt="songImage"
                      className="object-cover  h-full rounded-[4px]"
                      src={
                        item.thumbnail === ""
                          ? "https://firebasestorage.googleapis.com/v0/b/spotify-clone-350f3.appspot.com/o/playlistDefault.png?alt=media&token=99a06d44-2dee-412e-b659-695b591af95c"
                          : item.thumbnail
                      }
                    />
                  </div>
                  <div className="flex-1 flex flex-col pr-3  text-left">
                    <Link
                      href={`/song/${item._id}`}
                      className="text-white hover:underline leading-tight text-[16px] font-normal"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center">
                      {item.artists.map((artist, id) => {
                        return (
                          <Link
                            key={id}
                            href={`/artist/${artist._id}`}
                            className="leading-tight text-md font-normal text-secondaryText hover:text-white hover:underline"
                          >
                            {artist.name}
                            {id !== item.artists.length - 1 && (
                              <span className="pr-1">{`, `}</span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-6/12 pr-3 text-left">
                {item?.album ? (
                  <Link
                    href={`/album/${item?.album?._id}`}
                    className="leading-tight text-md font-normal text-secondaryText hover:text-white hover:underline"
                  >
                    {item?.album?.name}
                  </Link>
                ) : (
                  <Link
                    href={`/song/${item?._id}`}
                    className="leading-tight text-md font-normal text-secondaryText hover:text-white hover:underline"
                  >
                    {item?.name}
                  </Link>
                )}
              </div>

              <div className="flex relative items-center justify-center gap-2 text-center w-[130px]">
                {/* {songHover && (
                              <button className="absolute bg-green-400 left-4 p-1 rounded-full">
                                <FaCheck className="text-black text-[10px]" />
                              </button>
                            )} */}
                <button className="px-3.5  rounded-full absolute right-5 hover:border-white three-dot border border-secondaryText  outline-none text-white hover:scale-105 transition-all ease-out duration-150">
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
