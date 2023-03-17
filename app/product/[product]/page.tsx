"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/logo.png";
import Locked from "/public/locked.png";
import PocketBase from "pocketbase";
import { ethers, BigNumber } from "ethers";
import {
  accessContractAddress,
  subscriptionAddress,
} from "../../../utils/Config";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccessABI = require("/utils/ABI/accessABI.json");
const subscriptionABI = require("/utils/ABI/subscriptionABI.json");

export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto",
  runtime = "nodejs",
  preferredRegion = "auto";

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

async function getAllProduct(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PBURL!}/api/collections/products/records/${id}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data as product;
}

async function getBlobUrls(url: string) {
  const res = await fetch(url, {
    cache: "no-store",
  });

  let objUrl = "";
  const blob = await res.blob();

  objUrl = URL.createObjectURL(blob);

  return objUrl as string;
}

interface video {
  videoName: string;
  thumbnail: string;
}

interface product {
  collectionId: string;
  id: string;
  productName: string;
  subscription: boolean;
  subscriptionPrice: number;
  productPrice: number;
  thumbnail: string;
  description: string;
  videos: video[];
  created: string;
}

interface url {
  videoName: string;
  link: string;
}

function Product({ params }: any) {
  const productId = params.product;
  const { address, isConnected } = useAccount();
  const [pDetails, setPDetails] = useState<product>();
  const [cObj, setCObj] = useState<video[]>();
  const [videoData, setVideoData] = useState<url[]>();
  const [videoClick, setVideoClick] = useState<boolean>(false);
  const [subscribealble, setSubscribealble] = useState<boolean>(false);
  const [subEnded, setSubEnded] = useState<boolean>(false);
  const [videosrc, setVideoSrc] = useState<string>("");
  const [access, setAccess] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const search = searchParams.get("catIndex");
  const router = useRouter();
  const loadingVideo =
    "https://bafkreihwjxofnkk33xwjgtmhvj4k4dmogyzy72gjwzlsflnfppnv5lxosq.ipfs.nftstorage.link";

  const checkAccess = async (address: string, catIndex: number) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner(address);
    const accessContract = new ethers.Contract(
      accessContractAddress,
      AccessABI,
      signer
    );

    const access = await accessContract.accessGranted(address, catIndex);
    return access;
  };

  async function accessWait() {
    if (address != undefined && search != null) {
      const accessres = await checkAccess(address, Number(search));
      const productDetails: product = await getAllProduct(productId);
      const subscribe = productDetails.subscription;

      if (!accessres) {
        router.push(`/Minting?catIndex=${search}`);
      } else if (subscribe) {
        checkSubscription();
        setStatus(false);
      } else {
        load1();
        load();
        setStatus(false);
      }
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      accessWait();
    }
  }, [productId, address, isConnected, searchParams, router]);

  const getUrls = async (productId: string) => {
    const response = await fetch("/api/getVideoInformation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });
    const data = await response.json();
    return data.message as url[];
  };

  const checkSubscription = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner(address);
    const subContract = new ethers.Contract(
      subscriptionAddress,
      subscriptionABI,
      signer
    );

    const isSubscribed = await subContract.subscribed(address, productId);
    const subEnd = await subContract.subscriptionEndTimes(address, productId);
    const subscriptionEndTimes = subEnd.toString();
    const currentTime = Date.now() / 1000;
    if (isSubscribed && Number(subscriptionEndTimes) > currentTime) {
      setSubEnded(true);
    }

    if (isSubscribed && Number(subscriptionEndTimes) > currentTime) {
      const urls = await getUrls(productId);
      setVideoData(urls);
      setAccess(true);
      load();
    } else {
      load();
      setVideoData([]);
    }
  };

  async function load() {
    const productDetails: product = await getAllProduct(productId);
    setPDetails(productDetails);
    const contentObj: video[] = productDetails.videos;
    setCObj(contentObj);
    const subscribe = productDetails.subscription;
    setSubscribealble(subscribe);
  }

  async function load1() {
    if (address != undefined) {
      const res = await getPurchaseInformation(address, productId);
      console.log(res);

      if (res === undefined) {
        setVideoData([]);
        setAccess(false);
        load();
      } else {
        const urls = await getUrls(productId);
        setVideoData(urls);
        setAccess(true);
      }
    }
  }

  const purchase = async (
    walletAddress: string,
    productID: string,
    purchaseTxHash: string
  ) => {
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

    setTimeout(() => {
      console.log("this is the first message");
      window.location.reload();
    }, 5000);
  };

  const sendTx = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const gasPrice = provider.getGasPrice();

    try {
      let pPrice;
      let pId;

      if (pDetails != undefined) {
        pPrice = pDetails.productPrice;
        pId = pDetails.id;
      }

      const tx = {
        from: address,
        to: "0x6C591CF2C14Cf2dadd995644984f8d61B1B4703D",
        value: BigNumber.from(ethers.utils.parseEther(pPrice.toString())),
        gasPrice: gasPrice,
        nonce: provider.getTransactionCount(address!, "latest"),
      };
      const transaction = await signer.sendTransaction(tx);
      const wait = await provider.waitForTransaction(transaction.hash);
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
      purchase(address!, pId, transaction.hash);
    } catch (error: any) {
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

  async function getBlob(url: string) {
    setVideoSrc(loadingVideo);
    const blobbed = await getBlobUrls(url);
    setVideoSrc(blobbed);
  }

  if (status) {
    return (
      <div className="hero min-h-screen bg-[#120F22]">
        <div className="hero-content text-center bg-transparent">
          <p className="text-purple-800">Loading </p>
          <progress className="progress w-56"></progress>
        </div>
      </div>
    );
  }

  return (
    <div className="bgclass min-h-screen font-normal text-white text-xl">
      <div className="p-2">
        <Link className="inline-block" href="/">
          <Image className="w-[20vh]" src={Logo} alt="logo" priority={true} />
        </Link>
      </div>
      <div className="desktop:container laptop:container mx-auto">
        <div className="mt-12">
          {videoClick ? (
            <video
              className="desktop:w-[50vw] laptop:w-[70vw] mobile:w-[90vw] mx-auto my-auto p-4 glassEffect rounded-2xl"
              controls={videosrc !== loadingVideo}
              autoPlay
              controlsList="nodownload"
              src={videosrc}
            />
          ) : (
            pDetails != undefined && (
              <img
                className="desktop:w-[50vw] laptop:w-[70vw] mobile:w-[90vw] mx-auto my-auto rounded-2xl"
                src={pDetails.thumbnail}
                alt="thumbnail"
              />
            )
          )}

          <div className="desktop:grid desktop:grid-cols-2 laptop:grid laptop:grid-cols-2 p-4 mt-10">
            <div className="mx-4 p-3 rounded-2xl glassEffect h-48">
              <div className="my-10">
                <h2 className="text-2xl ubuntu.className">
                  {pDetails != undefined && pDetails.productName}
                </h2>

                {pDetails != undefined && pDetails.subscription ? (
                  !subEnded ? (
                    <Link
                      className="fixed top-8 right-4"
                      href={`/subscribe/${pDetails.id}`}
                    >
                      <button className="float-right glassEffect rounded-xl py-2 px-2 text-center">
                        <p className=" text-base font-semibold">
                          {pDetails.subscriptionPrice} ETH
                        </p>
                        <p className="font-light">Subscribe </p>
                      </button>
                    </Link>
                  ) : null
                ) : (
                  !access && (
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
                        <p className=" text-base font-semibold">
                          {pDetails != undefined && pDetails.productPrice} ETH
                        </p>
                        <p className="font-light">Purchase</p>
                      </button>
                    </form>
                  )
                )}
              </div>
              <p className="text-base">
                {pDetails != undefined && pDetails.description}
              </p>
            </div>

            <div className="mx-4 p-3 rounded-2xl glassEffect desktop:pt-10 laptop:pt-10 tablet:pt-10 mobile:pt-10 desktop:mt-0 laptop:mt-0 tablet:mt-0 mobile:mt-6">
              <span className="pl-2 pt-3 text-2xl ubuntu.className">
                Content
              </span>
              {!access &&
                cObj != undefined &&
                cObj.map((data: video, index: number) => {
                  return (
                    <div
                      key={index}
                      className="my-4 p-3 flex justify-between hover:backdrop-blur-sm rounded-xl cursor-pointer tooltip"
                      data-tip="Locked"
                    >
                      <div>
                        <img
                          className="w-[80px] inline mr-4"
                          src={data.thumbnail}
                          alt="thumbnail"
                        />
                        <span className="my-auto">{data.videoName} </span>
                      </div>

                      <span className="my-auto">
                        <Image className="w-[30px]" src={Locked} alt="locked" />{" "}
                      </span>
                    </div>
                  );
                })}

              {access &&
                videoData != undefined &&
                videoData.map((data, index: number) => {
                  return (
                    <div
                      key={index}
                      className="my-4 p-3 flex justify-between hover:backdrop-blur-sm rounded-xl cursor-pointer"
                      onClick={() => {
                        setVideoClick(true);
                        getBlob(data.link);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      <div>
                        <video
                          className="w-[80px] inline mr-4"
                          src={data.link}
                        />
                        <span className="my-auto">{data.videoName}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
