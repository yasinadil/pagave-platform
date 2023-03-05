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
  const searchParams = useSearchParams();
  const search = searchParams.get("catIndex");
  const router = useRouter();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function videoLoad() {
      const mediaSource = new MediaSource();

      const video = document.querySelector("video");

      // video.oncanplay = e => video.play();

      const urls = [
        "ipfs://bafybeihuecvbecxdzgs3j2fa6vlk7xmrbeiofbk5w725hmko4qfwhore4a",
      ];

      const request = (url) =>
        fetch(url).then((response) => response.arrayBuffer());

      // `urls.reverse()` stops at `.currentTime` : `9`
      const files = await Promise.all(urls.map(request));

      /*
       `.webm` files 'SourceBuffer': This SourceBuffer has been removed from the parent media
       Uncaught DOMException: Failed to execute 'appendBuffer' on source.
       Uncaught DOMException: Failed to set the 'timestampOffset' property on 'SourceBuffer': This SourceBuffer has been removed from the parent media source.
      */
      // const mimeCodec = "video/webm; codecs=opus";
      // https://stackoverflow.com/questions/14108536/how-do-i-append-two-video-files-data-to-a-source-buffer-using-media-source-api/
      const mimeCodec = 'video/mp4; codecs="avc1.42E01E,mp4a.40.2"';

      const media = await Promise.all(
        files.map((file) => {
          return new Promise((resolve) => {
            let media = document.createElement("video");
            let blobURL = URL.createObjectURL(new Blob([file]));
            media.onloadedmetadata = async (e) => {
              resolve({
                mediaDuration: media.duration,
                mediaBuffer: file,
              });
            };
            media.src = blobURL;
          });
        })
      );

      console.log(media);

      mediaSource.addEventListener("sourceopen", sourceOpen);

      video!.src = URL.createObjectURL(mediaSource);

      async function sourceOpen(event) {
        if (MediaSource.isTypeSupported(mimeCodec)) {
          const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

          for (let chunk of media) {
            await new Promise((resolve) => {
              sourceBuffer.appendBuffer((chunk as any).mediaBuffer);
              sourceBuffer.onupdateend = (e) => {
                sourceBuffer.onupdateend = null;
                sourceBuffer.timestampOffset += (chunk as any).mediaDuration;
                console.log(mediaSource.duration);
                resolve(sourceBuffer);
              };
            });
          }

          mediaSource.endOfStream();
        } else {
          console.warn(mimeCodec + " not supported");
        }
      }
    }
    videoLoad();

    // const videoElement = videoRef.current;
    // const mediaSource = new MediaSource();
    // if (videoElement != null) {
    //   videoElement.src = URL.createObjectURL(mediaSource);
    //   mediaSource.addEventListener("sourceopen", () => {
    //     const sourceBuffer = mediaSource.addSourceBuffer(
    //       'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
    //     );

    //     fetch(
    //       "https://raw.githubusercontent.com/chromium/chromium/b4b3566f27d2814fbba1b115639eb7801dd691cf/media/test/data/bear-vp9-opus.webm"
    //     )
    //       .then((response) => response.arrayBuffer())
    //       .then((data) => {
    //         sourceBuffer.appendBuffer(data);
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching video:", error);
    //       });
    //   });

    //   videoElement.addEventListener("error", (event: ErrorEvent) => {
    //     console.error("Video error:", (event.target as HTMLMediaElement).error);
    //   });

    //   return () => {
    //     mediaSource.endOfStream();
    //   };
    // }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      accessWait();
    }

    async function accessWait() {
      if (address != undefined && search != null) {
        const accessres = await checkAccess(address, Number(search));
        const productDetails: product = await getAllProduct(productId);
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
    }
  }, [productId, address, isConnected, searchParams, router]);

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

      if (res === undefined) {
        setVideoData([]);
      } else {
        const urls = await getUrls(productId);

        setVideoData(urls);
        setAccess(true);
      }
    }
  }

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
        to: "0x25591dCe3C34320ED69aaBC1642d3fC04990832b",
        value: BigNumber.from(ethers.utils.parseEther(pPrice.toString())),
        gasPrice: gasPrice,
        nonce: provider.getTransactionCount(address!, "latest"),
      };
      const transaction = await signer.sendTransaction(tx);
      const wait = await provider.waitForTransaction(transaction.hash);
      load1();
      purchase(address!, pId, transaction.hash);

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

  return (
    <div className="bgclass min-h-screen font-normal text-white text-xl">
      <div className="p-2">
        <Link href="/">
          <Image className="w-[20vh]" src={Logo} alt="logo" priority={true} />
        </Link>
      </div>
      <div className="desktop:container laptop:container mx-auto">
        <div className="mt-12">
          {!videoClick ? (
            // <video
            //   className="desktop:w-[50vw] laptop:w-[40vw] mobile:w-[90vw] mx-auto my-auto p-4 glassEffect"
            //   controls
            //   autoPlay
            //   controlsList="nodownload"
            //   src={videosrc}
            // />
            // <video ref={videoRef} width="640" height="360" controls>
            //   <source type="video/mp4" />
            // </video>
            <video controls>
              <source src="" type="video/webm" />
            </video>
          ) : (
            pDetails != undefined && (
              <img
                className="desktop:w-[50vw] laptop:w-[40vw] mobile:w-[90vw] mx-auto my-auto rounded-2xl"
                src={pDetails.thumbnail}
                alt="thumbnail"
              />
            )
          )}

          <div className="desktop:grid desktop:grid-cols-2 p-4 mt-10">
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
                        setVideoSrc(data.link);
                        setVideoClick(true);
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
