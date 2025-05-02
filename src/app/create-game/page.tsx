"use client";

import React, { useState, useEffect } from "react";
import Step1 from "./features/Step1";
import Step2 from "./features/Step2";
import Link from "next/link";
import Step3 from "./features/Step3";
import { useRouter } from "next/navigation";
import { Character } from "@/lib/characters";
import useOnlineGameStore from "@/store/online-game-store";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StakeDetails } from "@/store/online-game-store";
import { toast } from "react-toastify";
import { UserButton, useWallet } from "@civic/auth-web3/react";

function CreateGameMultiStepForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [step1Value, setStep1Value] = useState<number | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [roomStakeDetails, setRoomStakeDetails] = useState<StakeDetails | null>(
    null
  );
  const [roomId, setRoomId] = useState("");
  const [roomToJoinId, setRoomToJoinId] = useState<string | null>(null);
  const {
    createOnlineGameRoom,
    joinGameRoom,
    selectCharacters,
    getStakeDetails,
  } = useOnlineGameStore();

  const router = useRouter();
  const { address, wallet } = useWallet({type: 'solana'});

  const searchParams = useSearchParams();

useEffect(() => {
  const gid = searchParams.get("gid");
  if (gid) {
    setRoomToJoinId(gid);
  }
}, [searchParams]);

useEffect(() => {
  if (roomToJoinId) {
    getRoomStakeDetails(roomToJoinId);
  }
}, [roomToJoinId]);

async function getRoomStakeDetails(roomId: string) {
  try {
    const data = await getStakeDetails(roomId);
    console.log("Fetched stake details:", data);
    if (!data) throw new Error('No stake details found');
    
    setRoomStakeDetails(data);
    setStep1Value(data.stakeAmount);
  } catch (error) {
    console.error("Error fetching stake details:", error);
    toast.error(`Error loading game room: ${error instanceof Error ? error.message : error}`);
  }
}

const stakeDetails: StakeDetails = {
  name: 'solana',
  stakeAmount: step1Value as number,
  symbol: 'SOL',
  networkId: "EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG",
};

  const handleNext = async () => {
    try {
      if (currentStep < 2) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      toast.error(`Error in approval process`);
      throw error;
    }
  };

  const handleBack = () => setCurrentStep((prev) => (prev <= 0 || prev === 1 ? 1 : prev - 1));

  const handleSubmit = async () => {
    const formData = {
      amount: step1Value,
      option: selectedCharacter,
    };

    const newRoomId = await createOnlineGameRoom(
      address as string,
      stakeDetails
    );

    try {
      setRoomId(newRoomId);
      selectCharacters(
        newRoomId,
        formData?.option?.id as string,
        address as string
      );
    } catch (error) {
      toast.error(`Error creating game room: ${error}`);
      return;
    }

    handleNext();
  };

  async function joinActiveGameRoom(roomId: string) {
    const formData = {
      amount: step1Value as number,
      option: selectedCharacter,
    };

    try {
      joinGameRoom(roomId, address as string);
      selectCharacters(
        roomId,
        formData?.option?.id as string,
        address as string
      );
    } catch (error) {
      toast.error(`Error joining game room: ${error}`);
      return;
    }
    router.push(`/game-play/${roomId}`);
  }

  function FlowButton() {
    if (roomToJoinId === null) {
      return (
        <button
          className="gradient-tracker border-none disabled:!text-white/50 hover:gradient-tracker hover:text-white btn text-white h-12 !rounded-[5px] w-[349px] mt-[35px] bg-primary hover:bg-primary"
          onClick={handleSubmit}
          disabled={!selectedCharacter}
        >
          Create game
        </button>
      );
    } else {
      return (
        <button
          className="gradient-tracker border-none disabled:!text-white/50 hover:gradient-tracker bg-primary hover:bg-primary/80 hover:text-white btn text-white h-12 !rounded-[5px] w-[349px] mt-[35px]"
          onClick={() => joinActiveGameRoom(roomToJoinId)}
          disabled={!selectedCharacter}
        >
          Join game
        </button>
      );
    }
  }

  if (!wallet?.connected) {
    return (
      <div className="pt-4 h-screen overflow-auto bg-background flex justify-center items-center px-5">
        <div>
          {/* {roomStakeDetails ? (
            <div className="text-white">
              Set Network to {roomStakeDetails.name} to join game
            </div>
          ) : (
            <></>
          )} */}
          <UserButton className="text-white hover:text-black"/>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 h-screen overflow-auto bg-background flex flex-col items-center px-5">
      <div>
        {currentStep === 3 ? (
          <></>
        ) : (
          <div className="relative">
            <button
              onClick={handleBack}
              className="absolute p-0 bg-transparent top-0 left-0"
            >
              {currentStep === 1 ? (
                <Link href="/play">
                  <img
                    src="/arrow-back.png"
                    alt="arrow-back"
                    width={30}
                    height={30}
                  />
                </Link>
              ) : (
                <img
                  src="/arrow-back.png"
                  alt="arrow-back"
                  width={30}
                  height={30}
                />
              )}
            </button>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <Step1
              value={step1Value}
              onChange={setStep1Value}
              stakeDetails={roomStakeDetails}
            />
          </div>
        )}
        {currentStep === 2 && (
          <Step2
            selectedItem={selectedCharacter}
            onSelect={setSelectedCharacter}
          />
        )}
        {currentStep === 3 && <Step3 roomId={roomId} />}
      </div>

      <div className="flex justify-center pb-[130px]">
        {currentStep < 2 && (
          <button
            className="gradient-tracker border-none hover:gradient-tracker hover:text-white btn disabled:!text-white/50 text-white h-12 !rounded-[5px] w-[349px] mt-[35px] bg-primary hover:bg-primary/80"
            onClick={() => handleNext()}
            disabled={!step1Value}
          >
            Next
          </button>
        )}
        {currentStep === 2 && (
          <Suspense fallback={<div>Loading...</div>}>
            <FlowButton />
          </Suspense>
        )}
        {currentStep === 3 && (
          <button
            className="bg-white btn font-bold hover:text-primary text-primary hover:bg-white h-12 !rounded-[5px] w-fit px-3 mt-[35px]"
            disabled={!selectedCharacter}
            onClick={() => router.push("/play")}
          >
            View game details
          </button>
        )}
      </div>
    </div>
  );
}

export default function WrappedCreateGameMultiStepForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateGameMultiStepForm />
    </Suspense>
  );
}
