'use client'

import React from 'react'
import { UserButton, useWallet } from '@civic/auth-web3/react'
import ConnectButton from '@/components/ConnectButton'

export default function Wallet() {
  const { wallet } = useWallet({ type: "solana"});
  return (
    <div className='h-screen overflow-auto bg-background flex flex-col text-center justify-center items-center pb-32'>
        <img src='/stake-wars-logo.png' alt='img' width={135} height={76} />
        <h1 className='font-bold text-[24px] mt-7 text-white'>Connect your wallet</h1>
        <p className='mt-4 text-white'>Hey there Warrior!</p>
        <p className='mb-[91px] text-white'>Connect your wallet to get access to stake for battle</p>
        <UserButton className='text-white'/>
        {wallet?.connected ? <ConnectButton /> : wallet?.connecting ? <span className="loading loading-spinner loading-xs"></span> : <></>}
    </div>
  )
}
