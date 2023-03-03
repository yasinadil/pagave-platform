// Import required dependencies
import PocketBase from "pocketbase";

interface url {
  videoName: string;
  link: string;
}

export default async function handler(req, res) {
  const { productId } = req.body;

  const pb = new PocketBase("http://127.0.0.1:8090");
  await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL!,
    process.env.PB_ADMIN_PASS!
  );
  const token = pb.authStore.token;

  const apiEndpoint =
    "http://127.0.0.1:8090/api/collections/productsURL/records";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  fetch(apiEndpoint, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      let urls = "No urls";

      data?.items.map((item) => {
        if (item.productid == productId) {
          urls = item.urls;
          return item.urls as url;
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
