import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/d1ebc1ce4cf44962ab153dd5b95a2017",
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
