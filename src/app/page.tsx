import Wallet from '@/component/Wallet';
import { getUser } from '@civic/auth/nextjs';
import { UserButton } from "@civic/auth/react";
import { userHasWallet } from "@civic/auth-web3";
import { useUser } from "@civic/auth-web3/react";

export default async function Home() {
  const user = await getUser();
  
  return (
      <main>
          {user && (
            <div>Hello {user.email}</div>
          ) }
          <UserButton />
          <Wallet />
      </main>
  );
}