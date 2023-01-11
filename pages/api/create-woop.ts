import { NextApiRequest, NextApiResponse } from "next";
import { uploadIpfs } from "../../utils/ipfs";
import {
  selectToken,
  selectTokenDecimals,
  tokens,
  networks,
} from "../../utils/constants";
import { ethers } from "ethers";

export default async function createRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { fromAddress, tokenName, networkName, amount } = req.body;

  // Check that only POST methods are sent
  if (req.method !== "POST") {
    return res.status(400).send({ error: "Only POST methods are supported" });
  }

  // Check if all the required fields are present in the payload
  if (!fromAddress || !tokenName || !networkName || !amount) {
    return res
      .status(400)
      .send({ error: "Missing required fields in payload" });
  }

  // Check if address is a valid ethereum address
  try {
    ethers.utils.getAddress(fromAddress);
  } catch (error) {
    return res.status(400).send({ error: "Bad address checksum" });
  }

  if (!tokens.includes(tokenName)) {
    return res.status(400).send({
      error:
        "The token entered does not exist. The supported token names are ETH, MATIC, WETH, WBTC, DAI, USDC, USDT",
    });
  }

  if (!networks.includes(networkName)) {
    return res.status(400).send({
      error:
        "The network entered does not exist. The supported network names are goerli, homestead, optimism, arbitrum, matic",
    });
  }

  try {
    // Call the uploadIpfs function
    const result = await uploadIpfs({
      version: "1.0.0",
      from: String(fromAddress),
      value: String(amount),
      decimals: String(selectTokenDecimals(tokenName)),
      network: String(networkName),
      networkName: String(networkName),
      tokenName: String(tokenName),
      tokenAddress: String(selectToken(tokenName, networkName)),
    });
    // Send the response back to the client
    res.send({ result: `https://www.wooppay.xyz/woop/${result.cid}` });
  } catch (error: any) {
    // Handle the error and send a response back to the client
    res.status(500).send({ error: error.message });
  }
}
