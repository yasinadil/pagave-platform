"use client";
import * as React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
const AccessABI = require("/utils/ABI/accessABI.json");

function ProductCard(props) {
  const [walletAddress, setWalletAddress] = React.useState<string>("");
  const [access, setAccess] = React.useState<boolean>(false);
  const { address, isConnected } = useAccount();

  React.useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
    }
  }, [address, isConnected]);

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
        <p className="text-sm ">
          If a dog chews shoes whose shoes does he choose?
        </p>
        <div className="card-actions justify-end">
          {props.subscription ? (
            <button className=" glassEffect rounded-xl py-2 px-2 text-center w-full">
              <p className=" text-base font-semibold">{props.cost} ETH</p>
              <p className="font-light">Subscribe </p>
            </button>
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
                <p className="font-light">Purchase </p>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
