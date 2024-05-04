import { NextApiRequest, NextApiResponse } from "next";
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK(
  process.env.NEXT_PUBLIC_PINATA_KEY,
  process.env.NEXT_PUBLIC_PINATA_KEY_2
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const data = req.body;

      const result = await pinata.pinJSONToIPFS(data);

      return res.status(200).json(result);
    } else {
      return res.status(405).send("Method Not Allowed");
    }
  } catch (error) {
    return res.status(500).json({ error: "Error pinning to Pinata" });
  }
};

export default handler;
