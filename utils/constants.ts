import ethLogo from "../public/eth.png";
import wethLogo from "../public/weth.png";
import daiLogo from "../public/dai.png";
import usdcLogo from "../public/usdc.png";
import uniLogo from "../public/uni.png";

type Token = {
  label: string;
  logo: any;
  mainnet: string;
  goerli: string;
  optimism: string;
  arbitrum: string;

  [key: string]: any;
};

export const tokensDetails: Token[] = [
  {
    label: "ETH",
    logo: ethLogo,
    mainnet: "0x0000000000000000000000000000000000000000",
    goerli: "0x0000000000000000000000000000000000000000",
    optimism: "0x0000000000000000000000000000000000000000",
    arbitrum: "0x0000000000000000000000000000000000000000",
  },
  {
    label: "WETH",
    logo: wethLogo,
    mainnet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    goerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    optimism: "0x4200000000000000000000000000000000000006",
    arbitrum: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  },
  {
    label: "DAI",
    logo: daiLogo,
    mainnet: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    goerli: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
    optimism: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    arbitrum: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  },
  {
    label: "USDC",
    logo: usdcLogo,
    mainnet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    goerli: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    optimism: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    arbitrum: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
  },
  {
    label: "UNI",
    logo: uniLogo,
    mainnet: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    goerli: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    optimism: "0x6fd9d7AD17242c41f7131d257212c54A0e816691",
    arbitrum: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
  },
];

export const setEtherscanBase = (network: string, hash: string | undefined) => {
  if (network == "arbitrum") {
    return `https://arbiscan.io/tx/${hash}`;
  } else if (network == "goerli") {
    return `https://goerli.etherscan.io/tx/${hash}`;
  } else if (network == "optimism") {
    return `https://optimistic.etherscan.io/tx/${hash}`;
  } else if (network == "mainnet") {
    return `https://etherscan.io/tx/${hash}`;
  } else {
    return "...";
  }
};

export const setEtherscanAddress = (
  network: string,
  address: string | undefined
) => {
  if (network == "arbitrum") {
    return `https://arbiscan.io/address/${address}`;
  } else if (network == "goerli") {
    return `https://goerli.etherscan.io/address/${address}`;
  } else if (network == "optimism") {
    return `https://optimistic.etherscan.io/address/${address}`;
  } else if (network == "mainnet") {
    return `https://etherscan.io/address/${address}`;
  } else {
    return "...";
  }
};

export const baseUrl: string = "https://woop-pay-alpha.vercel.app/woop/";

export const selectToken = (
  token: string,
  network: string
): string | undefined => {
  const networks = ["goerli", "mainnet", "optimism", "arbitrum"];
  const tokens = ["ETH", "DAI", "USDC", "UNI"];

  let selectedToken: Token | undefined;

  if (networks.includes(network) && tokens.includes(token)) {
    selectedToken = tokensDetails.find((t) => t.label === token);
  }

  if (selectedToken && selectedToken[network]) {
    return selectedToken[network];
  } else {
    return undefined;
  }
};
