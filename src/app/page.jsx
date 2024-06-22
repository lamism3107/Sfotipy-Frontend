"use client";

import Image from "next/image";
import MainLayout from "./Layout/MainLayout";
import Header from "../components/Header/Header";
import Section from "../components/Section/Section";
import Sidebar from "../components/Sidebar/Sidebar";

function Home() {
  return (
    <MainLayout>
      <Sidebar />
      <div className="w-[calc(75%-8px)] absolute -z-10 right-0 top-0 ml-8">
        <Header />

        <div className="max-h-[calc(80vh-24px)] mt-[76px] overflow-y-scroll overflow-x-hidden rounded-b-lg bg-secondaryBg mx-2 px-3">
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

      {/* <Section /> */}
      {/* </div> */}

      {/* <SongBar /> */}
    </MainLayout>
  );
}

export default Home;
