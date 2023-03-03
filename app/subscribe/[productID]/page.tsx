"use client";
import * as React from "react";
import { subscriptionAddress } from "/utils/Config";
import { ethers, BigNumber } from "ethers";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/logo.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const subscriptionABI = require("/utils/ABI/subscriptionABI.json");

function Subscribe({ params }: any) {
  const productID = params.productID;
  const router = useRouter();

  const [subCost, setSubCost] = React.useState<string>("Loading...");
  const [subDuration, setSubDuration] = React.useState<string>("");
  const { address, isConnected } = useAccount();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [subEnded, setSubEnded] = useState<bool>(false);

  React.useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    }
    async function loadPrice() {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API}`
      );
      const subContract = new ethers.Contract(
        subscriptionAddress,
        subscriptionABI,
        provider
      );

      const product = await subContract.ProductDetails(productID);
      const subPrice = product.subscriptionCost;
      setSubCost(subPrice.toString());

      const subDur = product.subscriptionDuration;
      const subDurStr = subDur.toString();
      const subDurNum = Number(subDurStr) / 86400;
      setSubDuration(`${subDurNum} Days`);

      const isSubscribed = await subContract.subscribed(address, productID);

      const subEnd = await subContract.subscriptionEndTimes(address, productID);
      const subscriptionEndTimes = subEnd.toString();
      const currentTime = Date.now() / 1000;
      if (isSubscribed && Number(subscriptionEndTimes) > currentTime) {
        setSubEnded(true);
      }
    }
    loadPrice();
  }, [address, isConnected, productID]);

  const handleSubscribe = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner(address);
    const subContract = new ethers.Contract(
      subscriptionAddress,
      subscriptionABI,
      signer
    );
    try {
      const response = await subContract.subscribe(productID, {
        value: BigNumber.from(subCost.toString()),
      });
      const wait = await provider.waitForTransaction(response.hash);
      toast.success("Subscribed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.back();
    } catch (error) {
      let message = error.reason;
      console.log(error);

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

  const handleRenewSubscription = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner(address);
    const subContract = new ethers.Contract(
      subscriptionAddress,
      subscriptionABI,
      signer
    );
    try {
      const response = await subContract.renewSubscription(productID, {
        value: BigNumber.from(subCost.toString()),
      });
      const wait = await provider.waitForTransaction(response.hash);
      toast.success("Subscription Renewed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.back();
    } catch (error) {
      let message = error.reason;
      console.log(error);

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
    <div className="hero min-h-screen bg-[#621B9E]">
      <div className="p-2">
        <Link href="/">
          <Image className="w-[20vh]" src={Logo} alt="logo" priority="true" />
        </Link>
      </div>
      <div className="hero-content">
        <div className="max-w-md">
          {subEnded == false ? (
            <div className="card card-compact desktop:w-96 laptop:w-96 tablet:w-96 mobile:w-80 glassEffect shadow-xl">
              {/* <figure>
              <img
                src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                alt="Shoes"
              />
            </figure> */}
              <div className="card-body">
                <h2 className="card-title">Subscribe</h2>
                <p className="py-4">
                  To get access to all in the videos in this product, subscribe
                  now!
                </p>
                <p className="font-semibold">
                  Subscription Cost:&nbsp;&nbsp;
                  {subCost != "Loading..." ? (
                    <span className="font-normal">
                      {ethers.utils.formatEther(subCost)} ETH / {subDuration}
                    </span>
                  ) : (
                    subCost
                  )}{" "}
                </p>
                <div className="card-actions justify-end">
                  <button
                    disabled={subCost == "Loading..."}
                    onClick={handleSubscribe}
                    className="btn btn-primary"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card card-compact desktop:w-96 laptop:w-96 tablet:w-96 mobile:w-72 bg-base-100 shadow-xl">
              {/* <figure>
              <img
                src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                alt="Shoes"
              />
            </figure> */}
              <div className="card-body">
                <h2 className="card-title">Renew Subscription</h2>
                <p className="py-4">
                  To continue your access to all the videos in this product,
                  renew your subscription!
                </p>
                <p className="font-semibold">
                  Renewal Cost:&nbsp;&nbsp;
                  {subCost != "Loading..." ? (
                    <span className="font-normal">
                      {ethers.utils.formatEther(subCost)} ETH / {subDuration}
                    </span>
                  ) : (
                    subCost
                  )}{" "}
                </p>
                <div className="card-actions justify-end">
                  <button
                    disabled={subCost == "Loading..."}
                    onClick={handleRenewSubscription}
                    className="btn btn-primary"
                  >
                    Renew Subscription
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
