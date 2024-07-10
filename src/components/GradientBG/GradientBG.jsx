import React from "react";

export default function GradientBG({ height, from }) {
  return (
    <div
      className={`${height} absolute z-100 top-0 w-[calc(100%+16px)] -right-2  bg-gradient-to-b ${from} to-[#121212]`}
    ></div>
  );
}
