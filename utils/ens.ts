import { JsonRpcProvider, Network } from "ethers";

const key = process.env.NEXT_PUBLIC_INFURA_KEY;
const url = `https://mainnet.infura.io/v3/${key}`;

const MAINNET_CHAIN_ID = 1;
const network = Network.from(MAINNET_CHAIN_ID);
const provider = new JsonRpcProvider(url, network, {
  staticNetwork: network,
});

export const getEnsName = async (address: string) => {
  try {
    const ensName = await provider.lookupAddress(address);
    return ensName;
  } catch (error) {
    console.error("Error resolving ENS name:", error);
    return null;
  }
};
