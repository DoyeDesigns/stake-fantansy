import React, { useEffect, useState } from "react";
import useOnlineGameStore from "@/store/online-game-store";
import { GameRoomDocument } from "@/store/online-game-store";
import HowToPlay from "@/components/HowToPlay";
import { toast } from 'react-toastify';
import { useWallet } from "@civic/auth-web3/react";


export default function PlayerStatistics() {
  const { findUserRooms } = useOnlineGameStore();
  const [joinedRooms, setJoinedRooms] = useState<GameRoomDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const {address} = useWallet({type: 'solana'});

  const compactHash = (hash: string) => {
    return hash.slice(0, 7) + '...' + hash.slice(-5)
  }

  const [statistics, setStatistics] = useState({
    totalBattles: 0,
    totalWins: 0,
    totalEarnings: 0
  });

  const calculateStatistics = (rooms: GameRoomDocument[]) => {
    const stats = rooms.reduce((acc, room) => {
      if (room.status === 'finished') {
        acc.totalBattles++;
  
        const gameState = room.gameState;
        if (gameState) {
          const isPlayer1 = gameState.player1.id === address;
          const isPlayer2 = gameState.player2.id === address;
          const didWin = (isPlayer1 && gameState.winner === 'player1') || 
                        (isPlayer2 && gameState.winner === 'player2');
  
          if (didWin) {
            acc.totalWins++;
            const stakeAmount = room.stakeDetails?.stakeAmount || 0;
            acc.totalEarnings += stakeAmount * 2;
          }
        }
      }

      return acc;
    }, {
      totalBattles: 0,
      totalWins: 0,
      totalEarnings: 0
    });

    setStatistics(stats);
  };

  const fetchJoinedRooms = async () => {
    setLoading(true);
    try {
      const rooms = await findUserRooms(address as string);
      
      const finishedRooms = (rooms || [])
        .filter(room => room.status === 'finished')
        .sort((a, b) => {
          return b.createdAt.seconds - a.createdAt.seconds;
        });
      
      setJoinedRooms(finishedRooms);
      
      calculateStatistics(finishedRooms);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error fetching joined rooms: ${error.message}`)
      }
    } finally {
      setLoading(false);
    }
  };


  const didUserWin = (room: GameRoomDocument, userId: string | undefined) => {
    return (room.gameState?.winner === 'player1' && room.gameState.player1.id === userId) ||
           (room.gameState?.winner === 'player2' && room.gameState.player2.id === userId);
  };

  useEffect(() => {
    fetchJoinedRooms();
  }, [address]);

  return (
    <div>
    {loading ? (<div className="flex justify-center"><span className="loading loading-dots loading-lg bg-primary"></span></div>) : joinedRooms.length === 0 ? (
        <p className="text-center text-white font-semibold my-6">
          You have not joined any rooms yet. Please join a room to start playing.
        </p>
      ) : (
        <div>
            <div className="flex gap-10 justify-center items-center pt-7 pb-6">
        <div className="flex flex-col">
          <h1 className="font-bold text-[16px] text-white mb-2">
          <span className="flex">{statistics.totalEarnings.toLocaleString()} SOL</span>
          </h1>
          <span className="font-normal text-[15px] text-white">
            Total Earned
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[16px] text-white mb-2 block">{statistics.totalBattles}</span>
          <span className="font-normal text-[15px] text-white block">
            Battles
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[16px] text-white mb-2 block">{statistics.totalWins}</span>
          <span className="font-normal text-[15px] text-white block">Wins</span>
        </div>
      </div>
      <div className="h-px bg-[#6A6868]"></div>
      <div className="flex gap-[200px] justify-center items-center pt-[32px] pb-[18px] text-white">
        <h2 className="font-bold text-[16px]">History</h2>
        <button onClick={fetchJoinedRooms} className="text-xs flex gap-2 items-center">
          <img src="/refresh.png" alt="refresh" width={20} height={20} />{" "}
          Refresh
        </button>
      </div>
      <div className="h-px bg-[#6A6868]"></div>
      <div className="flex justify-end my-[17px] w-[350px] mx-auto"><HowToPlay iconSize={16} textSize="text-sm" /></div>
      <div className="flex flex-col items-center pb-[150px] overflow-auto pt-[18px] gap-[6px]">
        {joinedRooms.map((room) => (
            <div key={room.id} className="bg-[#393939] h-[66px] rounded-[10px] flex justify-between items-center w-[364px] min-w-[250px] pr-[18px] pl-8 mx-2">
            <div className="flex gap-3 items-center">
              <img
                src={didUserWin(room, address) ? "/history-won-img.png" : "/history-lost-img.png"}
                alt={didUserWin(room, address) ? "history-won-img.png" : "history-lost-img.png"}
                width={39}
                height={39}
              />
              <div>
                <h3 className="font-semibold text-[18px] text-white">{didUserWin(room, address) ? 'Won' : 'Lost'}</h3>
                <span className="text-white text-[13px]">
                  vs <span className="text-secondary uppercase !w-[150px] truncate ... overflow-hidden"> {compactHash(Object.values(room.players)
                          .find(player => player.wallet !== address)
                          ?.wallet as string || '') || 'Unknown'}</span>
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-end items-center">
                <span className={`text-[13px] flex ${didUserWin(room, address) ? 'text-secondary' : 'text-accent'}`}>
                    <span className="pt-[2px] mr-1">{didUserWin(room, address) ? '+' : '-'} {room.stakeDetails?.stakeAmount.toLocaleString()} {room.stakeDetails?.symbol}</span>
                </span>
              </div>
              <div>
                <span className="text-[11px] text-white">
                {new Date(room.createdAt.toDate()).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
        </div>
    )} 
    </div>
  );
}
