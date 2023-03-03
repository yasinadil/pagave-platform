"use client";
import * as React from "react";
import PocketBase from "pocketbase";
import { ethers, BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter } from "next/navigation";

function ActionButton(props) {
  const [purchaseTxHash, setPurchaseTxHash] = React.useState("");
  const [productID, setProductID] = React.useState("");
  const [walletAddress, setWalletAddress] = React.useState("");
  const { address, isConnected } = useAccount();
  const productid = props.productID;
  const router = useRouter();

  React.useEffect(() => {
    if (address) {
      setProductID(productid);
      setWalletAddress(address);
    }
  }, [productid, address]);

  const purchase = async (
    walletAddress: string,
    productID: string,
    purchaseTxHash: string
  ) => {
    console.log(
      JSON.stringify({
        walletAddress,
        productID,
        purchaseTxHash,
      })
    );

    const response = await fetch("/api/addPurchaseRecord", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress,
        productID,
        purchaseTxHash,
      }),
    });

    const data = await response.json();
    console.log(data.message);
  };

  const sendTx = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const gasPrice = provider.getGasPrice();

    try {
      const tx = {
        from: address,
        to: "0x25591dCe3C34320ED69aaBC1642d3fC04990832b",
        value: BigNumber.from(
          ethers.utils.parseEther(props.productPrice.toString())
        ),
        gasPrice: gasPrice,
        nonce: provider.getTransactionCount(address, "latest"),
      };
      const transaction = await signer.sendTransaction(tx);
      console.log(transaction);
      setPurchaseTxHash(transaction.hash);
      const wait = await provider.waitForTransaction(transaction.hash);
      purchase(walletAddress, productID, transaction.hash);
      router.refresh();
      toast.success("Transfer Complete!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
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
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendTx();
        }}
      >
        <button
          type="submit"
          className="float-right glassEffect rounded-xl py-2 px-2 text-center fixed top-8 right-4"
        >
          <p className=" text-base font-semibold">{props.productPrice} ETH</p>
          <p className="font-light">Purchase</p>
        </button>
      </form>
    </>
  );
}

export default ActionButton;
