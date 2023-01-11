import { NextApiRequest, NextApiResponse } from "next";
import { uploadIpfs } from "../../utils/ipfs";
import { selectToken, selectTokenDecimals } from "../../utils/constants";

export default async function createRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { from, tokenName, network, value } = req.body;
  // Check if all the required fields are present in the payload
  if (!from || !tokenName || !network || !value) {
    return res
      .status(400)
      .send({ error: "Missing required fields in payload" });
  }
  try {
    // Call the uploadIpfs function
    const result = await uploadIpfs({
      version: "1.0.0",
      from: from,
      value: value,
      decimals: selectTokenDecimals(tokenName),
      network: network,
      networkName: network,
      tokenName: tokenName,
      tokenAddress: selectToken(tokenName, network),
    });
    // Send the response back to the client
    res.send({ result });
  } catch (error: any) {
    // Handle the error and send a response back to the client
    res.status(500).send({ error: error.message });
  }
}
