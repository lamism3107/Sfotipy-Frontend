"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header/Header";
import GradientBG from "../../../components/GradientBG/GradientBG";
import { useDispatch, useSelector } from "react-redux";
import * as playlistServices from "../../../services/playlist.api.js";
import { setCurrentPlaylist } from "../../../redux/slice/playlist.slice";
import Image from "next/image";
export default function PlaylistPage(props) {
  const { params } = props;
  const bodyRef = useRef();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const reduxCurrentPlaylist = useSelector(
    (state) => state.playlist.currentPlaylist
  );
  useEffect(() => {
    const getCurrentPlaylist = async () => {
      if (!reduxCurrentPlaylist) {
        const res = await playlistServices.getPlaylistById(params.slugs);
        if (res && res.success) {
          dispatch(setCurrentPlaylist(res.data));
        }
      }
    };
    if (!reduxCurrentPlaylist) {
      getCurrentPlaylist();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (bodyRef?.current.scrollTop > 40) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    bodyRef?.current?.addEventListener("scroll", handleScroll);
    return () => {
      bodyRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="h-[calc(100vh-95px)]">
      <Header isVisible={isVisible} />
      <div
        ref={bodyRef}
        className="h-[calc(100vh-95px)] relative z-0 containter bg-secondaryBg   rounded-lg overflow-y-auto overflow-x-hidden   mr-2"
      >
        <GradientBG height={"md:h-[550px]"} from="from-[#565656]" />
        <div className="mt-[80px] relative z-50 w-full h-full  max-h-[calc(77vh-25px)] ">
          {/* Playlist Header  */}
          <div className="pr-4 h-fit flex  justify-start items-center">
            <div className="p-6 ">
              <Image
                src={
                  reduxCurrentPlaylist?.thumbnail !== ""
                    ? reduxCurrentPlaylist?.thumbnail
                    : "/assets/playlistDefault.png"
                }
                className="shadow-[rgba(0,_0,_0,_0.8)_0px_30px_90px] rounded-[4px]"
                width={185}
                height={185}
                alt="thumbnail"
              />
            </div>

            {/* Text info  */}
            <div className="flex-1  flex flex-col justify-end  h-full w-full">
              <p className="text-white text-md mt-5 font-medium">
                {reduxCurrentPlaylist?.codeType}
              </p>
              <h1 className="text-white text-[84px] font-bold leading-[100px]">
                {reduxCurrentPlaylist?.name}
              </h1>
              <p className="text-white text-md font-semibold mt-5">
                {reduxCurrentPlaylist?.owner.name}
              </p>
            </div>
          </div>

          {/* Playlist Body  */}
          <div className="w-full min-h-[294px] overflow-y-scroll bg-darkOverlay "></div>
        </div>
      </div>
    </div>
  );
}
