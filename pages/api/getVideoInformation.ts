// Import required dependencies
import PocketBase from "pocketbase";

interface url {
  videoName: string;
  link: string;
}

export const dynamic = "auto",
  dynamicParams = true,
  revalidate = 0,
  fetchCache = "auto",
  runtime = "nodejs",
  preferredRegion = "auto";

export default async function handler(req, res) {
  const { productId } = req.body;

  const pb = new PocketBase(process.env.NEXT_PUBLIC_PBURL!);
  await pb.admins.authWithPassword(
    process.env.NEXT_PUBLIC_PB_ADMIN_EMAIL!,
    process.env.NEXT_PUBLIC_PB_ADMIN_PASS!
  );
  const token = pb.authStore.token;

  const apiEndpoint = `${process.env
    .NEXT_PUBLIC_PBURL!}/api/collections/productsURL/records`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  let urls = [];
  fetch(apiEndpoint, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      data?.items.map((item) => {
        if (item.productid == productId) {
          urls = item.url;
          return item.url as url;
        }
      });
      res.status(200).json({ message: urls });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).json({ message: "Error" });
    });

  pb.authStore.clear();
}
