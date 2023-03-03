"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import Link from "next/link";
import Logo from "/public/logo.png";
import placeholderImg from "/public/img-placeholder.png";
import Locked from "/public/locked.png";
import ActionButton from "/components/ActionButton/ActionButton";
import PocketBase from "pocketbase";
import { accessContractAddress, subscriptionAddress } from "/utils/Config";
import { ethers, BigNumber } from "ethers";
import { useSearchParams, useRouter } from "next/navigation";
import { Ubuntu } from "@next/font/google";
const AccessABI = require("/utils/ABI/accessABI.json");
const subscriptionABI = require("/utils/ABI/subscriptionABI.json");
const ubuntu = Ubuntu({
  weight: "500",
  subsets: ["latin"],
});

async function getPurchaseInformation(wallet: string, id: string) {
  try {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const result = await pb.collection("purchases").getList(1, 30, {
      filter: `walletAddress = "${wallet}" && productID = "${id}"`,
    });
    return result?.items[0];
  } catch (error) {
    return { error: error.message };
  }
}

async function getAllProduct(id: string) {
  const res = await fetch(
    `http://127.0.0.1:8090/api/collections/products/records/${id}`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data as object;
}

async function getBlobUrls(url: string) {
  const res = await fetch(url, {
    cache: "no-store",
  });

  let objUrl = null;
  const blob = await res.blob();

  objUrl = URL.createObjectURL(blob);

  return objUrl as string;
}

function Product({ params }: any) {
  const productId = params.product;
  const { address, isConnected } = useAccount();
  const [pDetails, setPDetails] = useState<Object>({});
  const [cObj, setCObj] = useState<Array>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [videoData, setVideoData] = useState<object[]>([{}]);
  const [videoClick, setVideoClick] = useState<bool>(false);
  const [subscribealble, setSubscribealble] = useState<bool>(false);
  const [subEnded, setSubEnded] = useState<bool>(false);
  const [subscribed, setSubscribed] = useState<bool>(false);
  const [videosrc, setVideoSrc] = useState<string>("");
  const [access, setAccess] = useState<bool>(false);
  const [catAccess, setCatAccess] = useState<bool>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      const search = searchParams.get("catIndex");
      async function accessWait() {
        const accessres = await checkAccess(address, search);

        const productDetails = await getAllProduct(productId);
        const subscribe = productDetails.subscription;

        if (!accessres) {
          router.push(`/Minting?catIndex=${search}`);
        } else if (subscribe) {
          checkSubscription();
        } else {
          load1();
          load();
        }
      }
      accessWait();
    }
    async function load1() {
      const res = await getPurchaseInformation(address, productId);

      if (res === undefined) {
        setVideoData([{}]);
      } else {
        const urls = await getUrls(productId);
        setVideoData(urls);
        setAccess(true);
      }
    }

    const checkSubscription = async () => {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const signer = provider.getSigner(address);
      const subContract = new ethers.Contract(
        subscriptionAddress,
        subscriptionABI,
        signer
      );

      const isSubscribed = await subContract.subscribed(address, productId);
      console.log(isSubscribed);

      const subEnd = await subContract.subscriptionEndTimes(address, productId);
      const subscriptionEndTimes = subEnd.toString();
      const currentTime = Date.now() / 1000;
      if (isSubscribed && Number(subscriptionEndTimes) > currentTime) {
        setSubEnded(true);
      }

      if (isSubscribed && Number(subscriptionEndTimes) > currentTime) {
        setSubscribed(true);
        const urls = await getUrls(productId);
        setVideoData(urls);
        setAccess(true);
        load();
      } else {
        load();
        setVideoData([{}]);
      }
    };

    async function load() {
      const productDetails = await getAllProduct(productId);
      setPDetails(productDetails);
      const contentObj = productDetails.videos;
      setCObj(contentObj);
      const subscribe = productDetails.subscription;
      setSubscribealble(subscribe);
    }
  }, [productId, address, isConnected, catAccess, searchParams, router]);

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
    return data.message as array;
  };

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

  return (
    <div className="bgclass min-h-screen font-normal text-white text-xl">
      <div className="p-2">
        <Link href="/">
          <Image className="w-[20vh]" src={Logo} alt="logo" priority="true" />
        </Link>
      </div>
      <div className="desktop:container laptop:container mx-auto">
        <div className="mt-12">
          {videoClick ? (
            <video
              className="desktop:w-[50vw] laptop:w-[40vw] mobile:w-[90vw] mx-auto my-auto p-4 glassEffect"
              controls
              autoPlay
              controlsList="nodownload"
              src={videosrc}
            />
          ) : (
            <img
              className="desktop:w-[50vw] laptop:w-[40vw] mobile:w-[90vw] mx-auto my-auto rounded-2xl"
              src={pDetails.thumbnail}
              alt="thumbnail"
              priority="true"
            />
          )}

          <div className="desktop:grid desktop:grid-cols-2 p-4 mt-10">
            <div className="mx-4 p-3 rounded-2xl glassEffect h-48">
              <div className="my-10">
                <h2 className="text-2xl ubuntu.className">
                  {pDetails.productName}
                </h2>

                {pDetails.subscription ? (
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
                    <ActionButton
                      productPrice={pDetails.productPrice}
                      productID={pDetails.id}
                    />
                  )
                )}
              </div>
              <p className="text-base">{pDetails.description}</p>
            </div>

            <div className="mx-4 p-3 rounded-2xl glassEffect desktop:pt-10 laptop:pt-10 tablet:pt-10 mobile:pt-10 desktop:mt-0 laptop:mt-0 tablet:mt-0 mobile:mt-6">
              <span className="pl-2 pt-3 text-2xl ubuntu.className">
                Content
              </span>
              {!access &&
                cObj.map((data: object, index: number) => {
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
                          priority="true"
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
                videoData.map((data: object, index: number) => {
                  return (
                    <div
                      key={index}
                      className="my-4 p-3 flex justify-between hover:backdrop-blur-sm rounded-xl cursor-pointer"
                      onClick={() => {
                        setVideoClick(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setVideoSrc(data.link);
                      }}
                    >
                      <div>
                        <video
                          className="w-[80px] inline mr-4"
                          src={data.link}
                        />
                        <span className="my-auto">{data.videoName} </span>
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
