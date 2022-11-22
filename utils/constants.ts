export const tokens = [
  {
    value: "eth",
    label: "WETH",
    contractAddress: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  },
  {
    value: "dai",
    label: "DAI",
    contractAddress: "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
  },
  {
    value: "usdc",
    label: "USDC",
    contractAddress: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
  },
];

export const selectToken = (token: string) => {
  if (token === "WETH") {
    return tokens[0];
  } else if (token == "DAI") {
    return tokens[1];
  } else if (token == "USDC") {
    return tokens[2];
  }
};
