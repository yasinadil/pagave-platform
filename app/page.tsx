import Image from "next/image";
import Link from "next/link";
import logo from "/public/logo.png";
import PocketBase from "pocketbase";

export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto",
  runtime = "nodejs",
  preferredRegion = "auto";

async function getAllCategories() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PBURL!);
  const records = await pb
    .collection("categories")
    .getFullList(200 /* batch size */, {
      sort: "+created",
    });
  return records as any[];
}

export default async function Home() {
  const allCategories = await getAllCategories();
  return (
    <div>
      <div className="hero bgclass min-h-screen heading">
        <div className="hero-content text-center desktop:w-[1000px] laptop:w-[1000px] border-4 border-[#621B9E]">
          <div className="">
            <div className="flex justify-center">
              <Image className="w-[30vh]" src={logo} alt="logo" />
            </div>
            <div className="text-center text-[#621B9E]">
              <ul>
                {allCategories.map((data, index) => {
                  return (
                    <li
                      key={data.id}
                      className="bg-white bg-opacity-80 my-3 py-4 mx-6 px-4"
                    >
                      <Link
                        href={{
                          pathname: `/category/${data.name}`,
                          query: { catIndex: index },
                        }}
                        className=""
                      >
                        <button className="desktop:text-3xl mobile:text-2xl">
                          {data.name}
                        </button>
                      </Link>{" "}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
