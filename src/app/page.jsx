"use client";
import MainLayout from "./Layout/MainLayout";
import Section from "../components/Section/Section";
import GradientBG from "../components/GradientBG/GradientBG";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";

function Home() {
  const bodyRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
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
    <MainLayout>
      <Header isVisible={isVisible} bgColor={"bg-secondaryBg"} title={<></>} />
      <div
        ref={bodyRef}
        className="containter bg-secondaryBg relative  rounded-lg overflow-y-auto overflow-x-hidden    px-1.5 mr-2"
      >
        <GradientBG height="md:h-[332px]" from={"from-[#303030]"} />
        <div className="mt-[90px] w-full h-full  max-h-[calc(77vh-25px)] ">
          <Section
            title={"Bài hát mới nhất"}
            type={"song"}
            // data={allSongs}
          />
          <Section
            title={"Nghệ sĩ phổ biến"}
            type="artist"
            //  data={allArtists}
          />
          <Section
            title={"Album phổ biến"}
            type="album"
            // data={allAlbums}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default Home;
