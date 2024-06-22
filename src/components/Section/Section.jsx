import React from "react";
import Link from "next/link";
import Card from "../Card/Card";

function Section({ title, type }) {
  return (
    <>
      <div
        className="bg-secondaryBg  max-h-[calc(100vh-56px)]  z-2  pt-4 pb-8 overflow-hidden"
        style={{ BiBorderRadius: "0.5rem" }}
      >
        <div className="px-4 flex justify-between mb-4 items-center">
          <span className="text-xl font-bold hover:underline cursor-pointer">
            {title}
          </span>
          <Link
            href={"/"}
            className="text-secondaryText text-md font-semibold hover:underline"
          >
            Hiện tất cả
          </Link>
        </div>
        <div className="grid gap-1 grid-cols-6">
          {/* {data?.map((item, index) => {
            return (
              <Card
                isArtist={type === "artist" ? true : false}
                data={item}
                type={type}
                index={index}
              />
            );
          })} */}
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </>
  );
}
export default Section;
