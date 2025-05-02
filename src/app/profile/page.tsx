'use client'

import React from 'react'
import PlayerStatistics from './features/PlayerStatistics';
import ConnectButton from '@/components/ConnectButton';
import { UserButton, useWallet } from '@civic/auth-web3/react';

export default function Profile() {
    const {wallet} = useWallet({type: 'solana'})
  return (
    <main className='h-screen overflow-auto bg-background flex flex-col justify-between'>
        <div>
        <div className='flex gap-5 justify-center pt-6 pb-8'>
            <div>
                <div className="avatar mt-2">
                    <div className="ring-[#f0b803] ring-offset-background w-[94px] h-[94px] rounded-full ring ring-offset-2">
                        <img src="/avater.jpg" />
                    </div>
                </div>
            </div>

            <div className='text-white'>
                {!wallet?.connected ? <UserButton className='text-white hover:text-black'/> : <ConnectButton />}
            </div>
        </div>
        <div className="h-px bg-[#6A6868]"></div>
        <PlayerStatistics/>
        </div>
    </main>
  )
}
