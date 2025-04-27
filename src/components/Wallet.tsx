"use client";

import {useEffect, useState} from "react";
import {clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction} from "@solana/web3.js";
import { useWallet, UserButton, useUser } from "@civic/auth-web3/react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { userHasWallet } from "@civic/auth-web3";

const useConnection = () => {
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    const con = new Connection(clusterApiUrl("devnet"));
    setConnection(con);
  }, []);

  return {connection};
}

// A simple hook to get the wallet's balance in lamports
const useBalance = () => {
  const [balance, setBalance] = useState<number>();
  // The Solana Wallet Adapter hooks
  const { connection } = useConnection();
  const { address } = useWallet({ type: "solana"});

  const publicKey = address ? new PublicKey(address) : null;

  if (connection && publicKey) {
    connection.getBalance(publicKey).then(setBalance);
  }

  return balance;
};

// Separate component for the app content that needs access to hooks
const Wallet = () => {
  // Get the Solana wallet balance
  const balance = useBalance();
  // Get the Solana address
  const { address, wallet } = useWallet({ type: "solana"});
  console.log("connected:", wallet?.connected)
  console.log("publicKey:", wallet?.publicKey)
  console.log("name:", wallet?.name)

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet?.publicKey as PublicKey,
      toPubkey: new PublicKey('7bE7J6BYD7Mk3LHa3H7TcANkhUfGt9cdJDaFmry7zax7'),
      lamports: 1000000,
    })
  );

  const con = new Connection(clusterApiUrl("devnet"));

  const sendTrasaction = async () => {
    try {
        wallet?.sendTransaction(transaction, con)
    } catch (error) {
        console.log(error)
    }
  }

  const signIn = async () => {
    try {
        wallet?.signIn()
    } catch (error) {
        console.log(error)
    }
  }

  return (
      <>
        {address && (
            <div>
              <p>Wallet address: {address}</p>
              <p>Balance: {balance !== null && balance !== undefined ? `${balance / 1e9} SOL` : "Loading..."}</p>
              <button onClick={sendTrasaction}> send transaction</button>
            </div>
        )}
      </>
  );
};

export default Wallet;
