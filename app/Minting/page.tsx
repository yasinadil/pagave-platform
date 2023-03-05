"use client";
import * as React from "react";
import { accessContractAddress } from "../../utils/Config";
import { ethers, BigNumber } from "ethers";
import { useSearchParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/logo.png";
import { log } from "console";
const AccessABI = require("../../utils/ABI/accessABI.json");
const metadata = require("../../utils/Metadata/metadata.json");

function MintingPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("catIndex");
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [mintbtn, setMintbtn] = React.useState<boolean>(false);
  const Metadata = metadata[Number(search)];

  React.useEffect(() => {
    if (isConnected && address) {
      check();
    }
  }, [address, router, isConnected, search]);

  async function check() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner(address);
    const accessContract = new ethers.Contract(
      accessContractAddress,
      AccessABI,
      signer
    );

    const access = await accessContract.accessGranted(address, search);
    if (access == true) {
      router.back();
    }
  }

  const handleMint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner(address);
    const accessContract = new ethers.Contract(
      accessContractAddress,
      AccessABI,
      signer
    );
    setMintbtn(true);
    try {
      const cost = await accessContract.rates(search);
      const access = await accessContract.mint(search, {
        value: BigNumber.from(cost.toString()),
      });
      const wait = await provider.waitForTransaction(access.hash);
      toast.success("Access Granted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setMintbtn(false);
      router.back();
    } catch (error: any) {
      setMintbtn(false);
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="hero min-h-screen bgclass text-white">
      <div className="fixed top-2 left-2">
        <Link href="/">
          <Image className="w-[20vh]" src={Logo} alt="logo" priority={true} />
        </Link>
      </div>

      {Metadata.image == undefined ? (
        <div className="rounded-md p-4 max-w-md w-full mx-auto">
          <div className="animate-pulse">
            <div className="flex justify-center">
              <div className="rounded-full bg-slate-700 h-64 w-64"></div>
            </div>
            <div className="flex-1 space-y-6 py-1 mt-6">
              <div className="h-6 bg-slate-700 rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-content text-center">
          <div className="card card-compact desktop:w-96 laptop:w-96 tablet:w-96 mobile:w-80 glassEffect shadow-xl">
            <figure>
              <img src={Metadata.image} alt="NFT picture" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{Metadata.name}</h2>
              <p className="text-left py-4">{Metadata.description}</p>
              <div className="card-actions justify-end">
                {mintbtn ? (
                  <button className="btn loading">Minting...</button>
                ) : (
                  <button onClick={handleMint} className="btn btn-primary">
                    Mint Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MintingPage;
