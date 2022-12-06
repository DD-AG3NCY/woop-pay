import ethLogo from "../public/eth.png";
import maticLogo from "../public/matic.png";
import wethLogo from "../public/weth.png";
import wbtcLogo from "../public/wbtc.png";
import daiLogo from "../public/dai.png";
import usdcLogo from "../public/usdc.png";
import uniLogo from "../public/uni.png";

type Token = {
  label: string;
  logo: any;
  homestead: string;
  goerli: string;
  optimism: string;
  arbitrum: string;
  matic: string;

  [key: string]: any;
};

export const tokensDetails: Token[] = [
  {
    label: "ETH",
    logo: ethLogo,
    homestead: "0x0000000000000000000000000000000000000000",
    goerli: "0x0000000000000000000000000000000000000000",
    optimism: "0x0000000000000000000000000000000000000000",
    arbitrum: "0x0000000000000000000000000000000000000000",
    matic: "0x0000000000000000000000000000000000000000",
  },
  {
    label: "MATIC",
    logo: maticLogo,
    homestead: "0x0000000000000000000000000000000000000000",
    goerli: "0x0000000000000000000000000000000000000000",
    optimism: "0x0000000000000000000000000000000000000000",
    arbitrum: "0x0000000000000000000000000000000000000000",
    matic: "0x0000000000000000000000000000000000000000",
  },
  {
    label: "WETH",
    logo: wethLogo,
    homestead: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    goerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    optimism: "0x4200000000000000000000000000000000000006",
    arbitrum: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    matic: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  },
  {
    label: "WBTC",
    logo: wbtcLogo,
    homestead: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    goerli: "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
    optimism: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    arbitrum: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    matic: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
  },
  {
    label: "DAI",
    logo: daiLogo,
    homestead: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    goerli: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
    optimism: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    arbitrum: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    matic: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  },
  {
    label: "USDC",
    logo: usdcLogo,
    homestead: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    goerli: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    optimism: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    arbitrum: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    matic: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  },
  {
    label: "UNI",
    logo: uniLogo,
    homestead: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    goerli: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    optimism: "0x6fd9d7AD17242c41f7131d257212c54A0e816691",
    arbitrum: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
    matic: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
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
  } else if (network == "matic") {
    return `https://polygonscan.com/tx/${hash}`;
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
  } else if (network == "matic") {
    return `https://polygonscan.com/address/${address}`;
  } else {
    return "...";
  }
};

export const baseUrl: string = "https://woop-pay-alpha.vercel.app/woop/";

export const selectToken = (
  token: string,
  network: string
): string | undefined => {
  const networks = ["goerli", "homestead", "optimism", "arbitrum", "matic"];
  const tokens = ["ETH", "MATIC", "WETH", "WBTC", "DAI", "USDC", "UNI"];

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
