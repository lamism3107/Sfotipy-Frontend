"use client";
import React, { useContext } from "react";
import "./Card.css";
import { FaPause, FaPlay } from "react-icons/fa";
// import { Context } from "../../context/StateProvider";
// import { actionTypes } from "../../context/actionTypes";
function Card() {
  // { isArtist, data, type, index }
  // const titleCard = () => {
  //   if (type === "artist") {
  //     return data.name;
  //   } else if (type === "album") {
  //     return data.album;
  //   } else {
  //     return data.name;
  //   }
  // };
  // const descCard = () => {
  //   if (type === "artist") {
  //     return data.description;
  //   } else if (type === "album") {
  //     return data.description;
  //   } else {
  //     return data.artist;
  //   }
  // };
  // const [state, dispatch] = useContext(Context);
  // const { masterSong, isPlaying } = state;

  // const { masterSong, isPlaying } = useSelector((state) => state.mainSong);
  // const { resetEverything, setSongIdx } = useGlobalContext();
  // const handlePlay = (data) => {
  //   console.log("playing");
  //   dispatch(index);
  //   console.log(index);
  //   if (isPlaying) {
  //     masterSong.songURL.currentTime = 0;
  //     masterSong.songURL.pause();
  //     // resetEverything();
  //     dispatch({
  //       type: actionTypes.RESET_EVERYTHING,
  //       payload: null,
  //     });
  //   }
  //   dispatch({
  //     type: actionTypes.PLAY_SONG,
  //     payload: data,
  //   });
  // };

  // const handlePause = () => {
  //   console.log(masterSong, data);

  //   dispatch({
  //     type: actionTypes.PAUSE_SONG_REQUEST,
  //   });
  // };

  return (
    <div className="card hover:bg-hoverBG cursor-pointer transition-all ease-out  col-span-1 p-3 rounded-lg overflow-hidden">
      <div className="relative w-full">
        <img
          src="/assets/img/albums/808.jpg"
          // {data.imgURL}
          alt=""
          // className={`${
          //   isArtist ? "rounded-full w-full h-full object-cover" : "rounded-md"
          // }`}
          className={`${"rounded-md"} object-cover w-full h-full`}
        />
        {/* {masterSong.id === data.id && isPlaying ? ( */}
        <button
          // onClick={handlePause}
          className="flex items-center play_btn absolute bottom-2 right-2 rounded-[50%] bg-green-500 justify-center p-3.5 drop-shadow-xl"
        >
          <FaPause className="text-black text-xl" />
        </button>
        {/* ) : (
            <button
              onClick={handlePause}
              className={`flex items-center play_btn absolute bottom-2 right-2 rounded-[50%] bg-green-500 justify-center p-3`}
            >
              <FaPlay className="text-black text-xl" />
            </button>
          )} */}
      </div>

      <h3 className="text-md mt-2  font-semibold mb-1">
        {/* {titleCard()} */}
        808 Album
      </h3>
      <p className="text-sm font-semibold text-secondaryText ">
        {/* {descCard()} */}
        Kanye West
      </p>
    </div>
  );
}

export default Card;
