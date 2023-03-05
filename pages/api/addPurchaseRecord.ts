// Import required dependencies
import PocketBase from "pocketbase";

export default async function handler(req, res) {
  const apiEndpoint = `${process.env
    .NEXT_PUBLIC_PBURL!}/api/collections/purchases/records`;

  const record = req.body;

  // Add code to create a new record in your database using the data from the request body
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PBURL!);
  await pb.admins.authWithPassword(
    process.env.NEXT_PUBLIC_PB_ADMIN_EMAIL!,
    process.env.NEXT_PUBLIC_PB_ADMIN_PASS!
  );
  const token = pb.authStore.token;

  // Set up request headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Make the API request using fetch
  fetch(apiEndpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(record),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Record created successfully");
        res.status(200).json({ message: "Purchase record added successfully" });
      } else {
        console.error(
          "Error creating record:",
          response.status,
          response.statusText
        );
        res.status(400).json({ message: "Error" });
      }
    })
    .catch((error) => {
      console.error("Error creating record:", error);
      res.status(400).json({ message: "Error" });
    });

  pb.authStore.clear();
}
