"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import mainLogo from "/public/logo.png";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { useSearchParams, useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

async function getAllProductsId(name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PBURL!}/api/collections/categories/records`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  let fields;
  data?.items.map((data) => {
    if (data.name == name) {
      fields = data.field;
    }
  });

  return fields as string[];
}

async function getDetails(name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PBURL!}/api/collections/categories/records`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  let fields;
  data?.items.map((data) => {
    if (data.name == name) {
      fields = data;
    }
  });

  return fields as category;
}

async function getAllProducts(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PBURL!}/api/collections/products/records`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  let fields;
  data?.items.map((data, index) => {
    if (data.id == id) {
      fields = data;
    }
  });

  return fields as products;
}

interface category {
  collectionId: string;
  collectionName: string;
  created: string;
  description: string;
  field: string[];
  id: string;
  name: string;
  questionnaire: string;
}

interface products {
  collectionId: string;
  id: string;
  productName: string;
  subscription: boolean;
  subscriptionPrice: number;
  productPrice: number;
  thumbnail: string;
  description: string;
  videos: object;
  created: string;
}

function Category({ params }: any) {
  const catName = params.catName;
  const [productsDetails, setProductsDetails] = useState<products[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<category>();
  const [catIndex, setCatIndex] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      const getChainId = async () => {
        try {
          const provider = new ethers.providers.Web3Provider(
            window.ethereum as any
          );
          const chainId = await provider
            .getNetwork()
            .then((network) => network.chainId);
          console.log("Current chain ID:", chainId);
          if (chainId != Number(process.env.NEXT_PUBLIC_CHAIN_ID!)) {
            await provider.send("wallet_switchEthereumChain", [
              { chainId: "0x" + process.env.NEXT_PUBLIC_CHAIN_ID! },
            ]);
          }
        } catch (error) {
          console.error(error);
        }
      };
      getChainId();
    } else {
      router.replace("/account");
    }

    async function load() {
      const search = searchParams.get("catIndex");
      if (search != null) {
        setCatIndex(Number(search));
      }

      const ProductsId = await getAllProductsId(catName);
      const categoryDetail = await getDetails(catName);
      setCategoryDetails(categoryDetail);

      if (ProductsId != undefined) {
        for (let i = 0; i < ProductsId.length; i++) {
          const details = await getAllProducts(ProductsId[i]);
          setProductsDetails((productsDetails) => [
            ...productsDetails,
            details,
          ]);
        }
      }
      setStatus(false);
    }

    load();
  }, [catName, searchParams]);

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
    <div className="bgclass">
      <div className="min-h-screen">
        <Link href="/">
          <Image className="w-[20vh] p-2" src={mainLogo} alt="logo" />
        </Link>

        <div className="grid grid-cols-8 gap-0 mt-16">
          <div> </div>
          <div className="text-center col-span-6">
            <span className="bg-white bg-opacity-80 desktop:text-3xl mobile:text-2xl px-6 py-4 text-[#621B9E] heading">
              {catName}
            </span>
            <p className="text-center text-white font-bold font-sans my-12 py-4 glassEffect rounded-2xl">
              {categoryDetails != undefined && categoryDetails.description}
            </p>
            {categoryDetails != undefined &&
            categoryDetails.questionnaire != "" ? (
              <div className="font-sans font-semibold glassEffect text-white py-4 rounded-2xl">
                <p className="text-center"> Link to questionnaire</p>
                <Link
                  className="underline"
                  href={categoryDetails.questionnaire}
                >
                  {categoryDetails.questionnaire}
                </Link>
              </div>
            ) : null}
          </div>
          <div> </div>
        </div>

        <div className="desktop:flex desktop:flex-wrap desktop:justify-start laptop:flex laptop:flex-wrap laptop:justify-start tablet:flex tablet:flex-wrap tablet:justify-center mobile:flex mobile:flex-wrap mobile:justify-center tablet:gap-x-4 tablet:gap-y-8 mobile:gap-x-4 mobile:gap-y-8 desktop:mx-12 mobile:mx-0 desktop:py-8 laptop:py-8 mobile:py-4 mx-auto my-auto">
          {productsDetails != undefined &&
            productsDetails.map((data, index) => {
              return (
                <ProductCard
                  key={index}
                  id={data.id}
                  name={data.productName}
                  source={data.thumbnail}
                  subscription={data.subscription}
                  cost={
                    data.subscription
                      ? data.subscriptionPrice
                      : data.productPrice
                  }
                  description={data.description}
                  catid={catIndex}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Category;
