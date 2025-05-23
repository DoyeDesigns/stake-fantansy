"use client";

import React from "react";
import { useState } from "react";
import ExitGame from "./ExitGame";
import { useRouter } from "next/navigation";
import { StakeDetails } from "@/store/online-game-store";



export default function WonMessage(stakeDetails: StakeDetails) {
  const [showExitOptions, setShowExitOptions] = useState(false);
  const router = useRouter();

  const handleExitOptions = () => {
    setShowExitOptions((prev) => !prev);
  };

  return (
    <div className="bg-[#191919]/60 h-full w-full top-0 left-0">
      {showExitOptions ? (
        <ExitGame
          showExitOptions={showExitOptions}
          setShowExitOptions={setShowExitOptions}
        />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className='flex justify-end w-[60%] -mt-20'>
        </div>
          <img
            src="/winner-background.png"
            alt="winner-bg"
            width={306}
            height={306}
          />
          <div className="flex flex-col justify-center items-center gap-4 -mt-48">
            <div className="flex flex-col justify-center items-center">
              <span className="text-white font-extrabold text-[22px] text-center">
                You Won!!
              </span>
              <span className="text-white font-extrabold text-[22px] text-center">
                {(stakeDetails.stakeAmount * 2).toLocaleString()}{stakeDetails.symbol}
              </span>
            </div>
            <button className="btn border-none bg-white text-primary font-bold text-[12px] w-[190px] rounded-[10px]">
              <img
                src="/telegram-share.png"
                alt="winner-bg"
                width={24}
                height={24}
              />{" "}
              Tell your friends
            </button>
            <button onClick={() => router.push('/create-game')} className="btn border-none bg-white text-primary font-bold text-[12px] w-[190px] rounded-[10px]">
              <img
                src="/rematch.png"
                alt="winner-bg"
                width={24}
                height={24}
              />{" "}
              Rematch
            </button>
            <button
              onClick={() => handleExitOptions()}
              className="btn border-none bg-white text-primary font-bold text-[12px] w-[190px] rounded-[10px]"
            >
              <img src="/exit.png" alt="winner-bg" width={24} height={24} />{" "}
              Exit Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
