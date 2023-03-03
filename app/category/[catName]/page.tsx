"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import mainLogo from "/public/logo.png";
import degree from "/public/degree.png";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { useSearchParams } from "next/navigation";

async function getAllProductsId(name: string) {
  const res = await fetch(
    "http://127.0.0.1:8090/api/collections/categories/records",
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  let fields;
  data?.items.map((data, index) => {
    if (data.name == name) {
      fields = data.field;
    }
  });

  return fields as string[];
}

async function getDetails(name: string) {
  const res = await fetch(
    "http://127.0.0.1:8090/api/collections/categories/records",
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  let fields;
  data?.items.map((data, index) => {
    if (data.name == name) {
      fields = data;
    }
  });

  return fields as string[];
}

async function getAllProducts(id: string) {
  const res = await fetch(
    "http://127.0.0.1:8090/api/collections/products/records",
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

  return fields as string[];
}

// interface category {
//   collectionId: string;
//   collectionName: string;
//   created: string;
//   description: string;
//   field: string[];
//   id: string;
//   name: string;
//   questionnaire: string;
// }

function Category({ params }: any) {
  const catName = params.catName;
  const [allProductsId, setAllProductsId] = useState<string[]>([]);
  const [productsDetails, setProductsDetails] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState<any>({});
  const [catIndex, setCatIndex] = useState<number>(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    async function load() {
      const search = searchParams.get("catIndex");
      if (search != null) {
        setCatIndex(Number(search));
      }

      const ProductsId = await getAllProductsId(catName);
      setAllProductsId(ProductsId);
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
    }
    load();
  }, [catName, searchParams]);

  return (
    <div className="bgclass">
      <div className="min-h-screen">
        <div className="p-2">
          <Link href="/">
            <Image className="w-[20vh]" src={mainLogo} alt="logo" />
          </Link>
        </div>
        <div className="grid grid-cols-8 gap-0 mt-16">
          <div> </div>
          <div className="text-center col-span-6">
            <span className="bg-white bg-opacity-80 desktop:text-3xl mobile:text-2xl px-6 py-4 text-[#621B9E] heading">
              {catName}
            </span>
            <p className="text-center text-black font-bold font-sans my-12">
              {categoryDetails.description}
            </p>
            {categoryDetails.questionnaire != undefined &&
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

        <div className="desktop:grid desktop:grid-cols-4 laptop:grid laptop:grid-cols-4 mobile:grid mobile:grid-cols-1 tablet:flex tablet:flex-grow tablet:flex-wrap tablet:gap-x-4 tablet:gap-y-8 mobile:gap-x-4 mobile:gap-y-8 desktop:mx-12 mobile:mx-0 desktop:py-8 laptop:py-8 mobile:py-4">
          {productsDetails.map((data, index) => {
            return (
              <ProductCard
                key={index}
                id={data.id}
                name={data.productName}
                source={data.thumbnail}
                subscription={data.subscription}
                cost={
                  data.subscription ? data.subscriptionPrice : data.productPrice
                }
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
