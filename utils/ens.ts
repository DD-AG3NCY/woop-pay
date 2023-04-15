import { ethers } from "ethers";

const key = process.env.NEXT_PUBLIC_INFURA_KEY;
const provider = new ethers.providers.JsonRpcProvider(
  `https://mainnet.infura.io/v3/${key}`,
  {
    chainId: 1,
    name: "homestead",
  }
);

export const getEnsName = async (address: string) => {
  try {
    const ensName = await provider.lookupAddress(address);
    return ensName;
  } catch (error) {
    console.error("Error resolving ENS name:", error);
    return null;
  }
};
