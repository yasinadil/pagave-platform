"use client";
import * as React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import PocketBase from "pocketbase";
import { ethers } from "ethers";
import { subscriptionAddress } from "../../utils/Config";
const subscriptionABI = require("/utils/ABI/subscriptionABI.json");

async function getPurchaseInformation(wallet: string, id: string) {
  try {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_PBURL!);
    const result = await pb.collection("purchases").getList(1, 30, {
      filter: `walletAddress = "${wallet}" && productID = "${id}"`,
    });
    return result?.items[0];
  } catch (error: any) {
    return { error: error.message };
  }
}

function ProductCard(props) {
  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const { address, isConnected } = useAccount();
  const [purchased, setPurchased] = React.useState<boolean>(false);
  const [subscribed, setSubscribed] = React.useState<boolean>(false);
  const [subEnded, setSubEnded] = React.useState<boolean>(false);

  React.useEffect(() => {
    async function checkChainID() {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_ALCHEMY_API
      );

      if (isConnected && address) {
        setWalletAddress(address);
        checkSubbed();
        checkPurchase();
      }
    }

    checkChainID();
  }, [address, isConnected]);

  async function checkPurchase() {
    const response = await getPurchaseInformation(address!, props.id);

    if (response != undefined || response != null) {
      setPurchased(true);
    }
  }

  async function checkSubbed() {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    let signer = provider.getSigner();
    const subContract = new ethers.Contract(
      subscriptionAddress,
      subscriptionABI,
      signer
    );

    const isSubscribed = await subContract.subscribed(address!, props.id);
    setSubscribed(isSubscribed);
    const subEnd = await subContract.subscriptionEndTimes(address!, props.id);
    const subscriptionEndTimes = subEnd.toString();
    const currentTime = Date.now() / 1000;
    if (isSubscribed && Number(subscriptionEndTimes) < currentTime) {
      setSubEnded(true);
    }
  }

  return (
    <div className="card card-compact w-72 glassEffect shadow-xl text-white mx-auto my-auto">
      <figure>
        <img className="mx-auto my-auto" src={props.source} alt="logo" />
      </figure>
      <div className="card-body font-sans">
        <Link
          href={{
            pathname: `/product/${props.id}`,
            query: { catIndex: props.catid },
          }}
        >
          <h2 className="text-xl ">{props.name}</h2>
        </Link>
        <p className="text-sm ">{props.description}</p>
        <div className="card-actions justify-end">
          {props.subscription ? (
            <button className=" glassEffect rounded-xl py-2 px-2 text-center w-full h-16">
              <p className=" text-base font-semibold">
                {!subscribed && subEnded && (
                  <p className="text-base font-semibold">{props.cost} ETH</p>
                )}
                {subscribed && subEnded && (
                  <p className="text-base font-semibold">{props.cost} ETH</p>
                )}
                {!subscribed && !subEnded && (
                  <p className="text-base font-semibold">{props.cost} ETH</p>
                )}
              </p>
              {!subscribed && <p className="font-light">Subscribe</p>}{" "}
              {subscribed && subEnded && (
                <p className="font-bold text-warning">Renew Subscription</p>
              )}{" "}
              {subscribed && !subEnded && (
                <p className="font-bold text-green-600">Active Subscription</p>
              )}{" "}
            </button>
          ) : purchased ? (
            <Link
              href={{
                pathname: `/product/${props.id}`,
                query: { catIndex: props.catid },
              }}
              className="rounded-xl w-full text-center glassEffect"
            >
              <button className="rounded-xl py-2 px-2 text-center h-16">
                {/* <div className="flex justify-center">
                  <Image src={tick} alt="Success" width={25} height={25} />
                </div> */}

                <p className="font-bold text-green-600">Purchased </p>
              </button>
            </Link>
          ) : (
            <Link
              href={{
                pathname: `/product/${props.id}`,
                query: { catIndex: props.catid },
              }}
              className="rounded-xl w-full text-center glassEffect"
            >
              <button className="  rounded-xl py-2 px-2 text-center">
                <p className=" text-base font-semibold">{props.cost} ETH</p>
                <p className="font-light">Purchase</p>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
