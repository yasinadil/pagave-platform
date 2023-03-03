"use client";
/* eslint-disable @next/next/no-head-element */
import Link from "next/link";
import Navbar from "../components/Navbar/Navbar";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import "./globalSheet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, isConnected } from "wagmi";
import { useState, useEffect } from "react";

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { address, isConnected } = useAccount();
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    }
  }, [isConnected, address]);

  return (
    <>
      <html lang="en">
        <head />
        <body cz-shortcut-listen="true">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <Navbar />
              {children}
            </RainbowKitProvider>
          </WagmiConfig>
        </body>
      </html>
    </>
  );
}
