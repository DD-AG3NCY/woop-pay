import wethLogo from "../public/weth.png";
import daiLogo from "../public/dai.png";
import usdcLogo from "../public/usdc.png";
import uniLogo from "../public/uni.png";
import aaveLogo from "../public/aave.png";

export const tokensDetails = [
  {
    src: wethLogo,
    label: "WETH",
    mainnet: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    goerli: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    polygon: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
  },
  {
    src: daiLogo,
    label: "DAI",
    mainnet: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    goerli: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
    polygon: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  },
  {
    src: usdcLogo,
    label: "USDC",
    mainnet: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    goerli: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    polygon: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  },
  {
    src: uniLogo,
    label: "UNI",
    mainnet: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    goerli: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    polygon: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
  },
  {
    src: aaveLogo,
    label: "AAVE",
    contractAddress: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
    mainnet: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    goerli: "0x63242b9bd3c22f18706d5c4e627b4735973f1f07",
    polygon: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
  },
];

export const baseUrl: string = "https://web3-pay-alpha.vercel.app/request/";

export const selectToken = (token: string, network: string) => {
  if (network == "goerli") {
    if (token === "WETH") {
      return tokensDetails[0].goerli;
    } else if (token == "DAI") {
      return tokensDetails[1].goerli;
    } else if (token == "USDC") {
      return tokensDetails[2].goerli;
    } else if (token == "UNI") {
      return tokensDetails[3].goerli;
    } else if (token == "AAVE") {
      return tokensDetails[4].goerli;
    }
  } else if (network == "mainnet") {
    if (token === "WETH") {
      return tokensDetails[0].mainnet;
    } else if (token == "DAI") {
      return tokensDetails[1].mainnet;
    } else if (token == "USDC") {
      return tokensDetails[2].mainnet;
    } else if (token == "UNI") {
      return tokensDetails[3].mainnet;
    } else if (token == "AAVE") {
      return tokensDetails[4].mainnet;
    }
  } else if (network == "polygon") {
    if (token === "WETH") {
      return tokensDetails[0].polygon;
    } else if (token == "DAI") {
      return tokensDetails[1].polygon;
    } else if (token == "USDC") {
      return tokensDetails[2].polygon;
    } else if (token == "UNI") {
      return tokensDetails[3].polygon;
    } else if (token == "AAVE") {
      return tokensDetails[4].polygon;
    }
  }
};
