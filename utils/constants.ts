import ethLogo from "../public/eth.png";
import maticLogo from "../public/matic.png";
import wethLogo from "../public/weth.png";
import wbtcLogo from "../public/wbtc.png";
import daiLogo from "../public/dai.png";
import usdcLogo from "../public/usdc.png";
import usdtLogo from "../public/usdt.png";

type Token = {
  label: string;
  logo: any;
  decimals: number;
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
    decimals: 18,
    homestead: "0x0000000000000000000000000000000000000000",
    goerli: "0x0000000000000000000000000000000000000000",
    optimism: "0x0000000000000000000000000000000000000000",
    arbitrum: "0x0000000000000000000000000000000000000000",
    matic: "0x0000000000000000000000000000000000000000",
  },
  {
    label: "MATIC",
    logo: maticLogo,
    decimals: 18,
    homestead: "0x0000000000000000000000000000000000000000",
    goerli: "0x0000000000000000000000000000000000000000",
    optimism: "0x0000000000000000000000000000000000000000",
    arbitrum: "0x0000000000000000000000000000000000000000",
    matic: "0x0000000000000000000000000000000000000000",
  },
  {
    label: "WETH",
    logo: wethLogo,
    decimals: 18,
    homestead: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    goerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    optimism: "0x4200000000000000000000000000000000000006",
    arbitrum: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    matic: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  },
  {
    label: "WBTC",
    logo: wbtcLogo,
    decimals: 8,
    homestead: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    goerli: "0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05",
    optimism: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    arbitrum: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    matic: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
  },
  {
    label: "DAI",
    logo: daiLogo,
    decimals: 18,
    homestead: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    goerli: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
    optimism: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    arbitrum: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    matic: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  },
  {
    label: "USDC",
    logo: usdcLogo,
    decimals: 6,
    homestead: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    goerli: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    optimism: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    arbitrum: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    matic: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  },
  {
    label: "USDT",
    logo: usdtLogo,
    decimals: 6,
    homestead: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    goerli: "0x509Ee0d083DdF8AC028f2a56731412edD63223B9",
    optimism: "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
    arbitrum: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    matic: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
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
  } else if (network == "homestead") {
    return `https://etherscan.io/address/${address}`;
  } else if (network == "matic") {
    return `https://polygonscan.com/address/${address}`;
  } else {
    return "...";
  }
};

export const baseUrl: string = "https://wooppay.xyz/woop/";

export const pushUrl: string = "https://staging.push.org/#/inbox";

export const networks: any = [
  "goerli",
  "homestead",
  "optimism",
  "arbitrum",
  "matic",
];
export const tokens: any = [
  "ETH",
  "MATIC",
  "WETH",
  "WBTC",
  "DAI",
  "USDC",
  "USDT",
];

export const selectToken = (token: any, network: any): string | undefined => {
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

export const selectTokenDecimals = (token: any): number | undefined => {
  const tokens: string[] | undefined = [
    "ETH",
    "MATIC",
    "WETH",
    "WBTC",
    "DAI",
    "USDC",
    "USDT",
  ];

  let selectedToken: Token | undefined;

  if (token && tokens.includes(token)) {
    selectedToken = tokensDetails.find((t) => t.label === token);
  }

  if (selectedToken) {
    return selectedToken.decimals;
  } else {
    return undefined;
  }
};
