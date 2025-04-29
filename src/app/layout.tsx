import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CivicAuthProvider } from "@civic/auth-web3/nextjs";  
import "./globals.css";
import { ToastContainer } from "react-toastify";
import NavBar from "@/components/NavBar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stake Fantasy",
  description: "A PvP staking battle game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
              <CivicAuthProvider>
                {children}
                <NavBar />
              </CivicAuthProvider>
              <ToastContainer autoClose={3000} />
      </body>
    </html>
  );
}
