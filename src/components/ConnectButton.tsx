"use client";

import { useWallet } from "@civic/auth-web3/react";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const compactHash = (hash: string) => {
  return hash.slice(0, 7) + "..." + hash.slice(-5);
};

const useConnection = () => {
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    const con = new Connection(clusterApiUrl("devnet"));
    setConnection(con);
  }, []);

  return {connection};
}

const useBalance = () => {
  const [balance, setBalance] = useState<number>();
  const { connection } = useConnection();
  const { address } = useWallet({ type: "solana"});

  const publicKey = address ? new PublicKey(address) : null;

  if (connection && publicKey) {
    connection.getBalance(publicKey).then(setBalance);
  }

  return balance;
};

export default function ConnectButton() {
  const { address } = useWallet({ type: "solana" });
  const compactAddress = compactHash(address || "");
  const balance = useBalance();

  const copyText = async (address : string) => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success("Copied Succesfully")
    } catch (err) {
      toast.error("Failed to copy text:");
    }
  }

  return (
    <div className="flex flex-col-reverse items-center gap-2 mt-4">
      <button
        onClick={() => copyText(address as string)}
        className="btn-xs flex hover:rounded-xl rounded-xl hover:bg-primary/95 items-center border-none w-fit bg-accent h-fit text-white font-bold"
      >
        Copy address
      </button>
      <span className="flex items-center gap-2">
          <Image
            className="inline-block"
            src="/wallet.png"
            alt="wallet"
            width={20}
            height={20}
          />
          {compactAddress}
        </span>

        <div className="text-white"><span>Account balance: {balance !== null && balance !== undefined ? `${balance / 1e9} SOL` : "Loading..."}</span></div>
    </div>
  );
}
