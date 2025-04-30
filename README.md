# 🎮 Stake Wars(A Crypto Combat Arena): PvP Battle Game

<div align="center">
  <img src="./public/stake-wars-logo.png" alt="Logo" width="200"/>
</div>

A blockchain-based battling game where players stake SOL, choose unique characters, and engage in dice-driven tactical combat on the Solana chain.

## 🌟 Key Features
- **Multi-Chain Battles** 🔗  
  Powered by Civic Auth embedded solana wallets
- **SOL Staking** 💰  
  Risk SOL tokens to challenge opponents with 2x reward potential
- **Character System** 🦸  
  4 unique characters with special abilities (Donald Pump, Vladmir Muffin, etc.)
- **Dice-Based Strategy** 🎲  
  Dynamic combat system combining chance and skill
- **Real-Time Firebase Sync** 🔥  
  Live battle tracking and game state management

## Project Presentation
- https://drive.google.com/file/d/1Nyv5Mf4mifk3K_gzsDfPTz3NfOb6x484/view?usp=drivesdk

## 🛠 Tech Stack
- **Blockchain**: Civic Auth (authentication & embedded wallets)
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore, Cloud Functions
- **Auth**: AppKit Wallet Connection (EOA & Smart Accounts)
- **State Management**: Zustand

## 🎮 Gameplay Overview

### 🛡️ Setup Phase

1. **Wallet Connection**
   - Automatic embedded solana wallets on account creation
   - Supported chains: Solana

<div align="center">
  <img src="/public/stake-sol.png" alt="Logo" width="200"/>
</div>

2. **Stake SOL**

<div align="center">
  <img src="/public/wallet-sol.png" alt="Logo" width="200"/>
</div>

## ⚔️ Combat Phase
The combat phase is where players engage in tactical battle using their chosen characters and dice rolls.

### 🔄 Turn Sequence
<div align="center">
  <div style="display: flex; justify-content: center; gap: 20px;">
    <img src="/public/won.gif" alt="Create Game Demo" width="200"/>
    <img src="/public/lost.gif" alt="Join Game Demo" width="200"/>
  </div>
</div>

```mermaid
graph TD
    A[Start Combat] --> B[Player 1 Dice Roll]
    B --> C{Resolve Attack}
    C -->|Damage| D[Player 2 Defense Phase]
    D --> E{Defense Choice}
    E -->|Reflect| F[Return Damage]
    F --> I[Player 2 Turn]
    E -->|Dodge| G[Player 2 Turn]
    E -->|Block| H[Reduce Damage]
    H --> I[Player 1 Turn]
```
