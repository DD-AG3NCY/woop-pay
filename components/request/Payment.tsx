import * as React from "react";
import { Share } from "./Share";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";

import { useAccount, useNetwork } from "wagmi";
import { uploadIpfs } from "../../utils/ipfs";
import { selectToken, tokensDetails } from "../../utils/constants";

import Image from "next/image";

export default function Payment(props: any) {
  const { setBadRequest, setAmountZeroRequest, setNoTokenRequest } = props;
  const [tokenLabel, setTokenLabel] = React.useState("");
  const [amount, setAmount] = React.useState<string>("0");
  const [path, setPath] = React.useState<string>("");
  const [ipfsLoading, setIpfsLoading] = React.useState<boolean>(false);
  const [chainId, setChainId] = React.useState<string>("");
  const { address } = useAccount();
  const { chain } = useNetwork();

  //event handlers
  const handleTokenLabelChange = (event: SelectChangeEvent) => {
    setTokenLabel(event.target.value as string);
  };

  const handleAmountChange = (event: any) => {
    setAmount(event.target.value as string);
  };

  //main functions
  const createRequest = async () => {
    setAmountZeroRequest(false);
    setNoTokenRequest(false);
    setBadRequest(false);

    if (amount == "0") {
      setAmountZeroRequest(true);
    } else if (tokenLabel == "") {
      setNoTokenRequest(true);
    } else {
      try {
        setIpfsLoading(true);
        const { path } = await uploadIpfs({
          version: "1.0.0",
          // metadata_id: uuid(), can be used in the future to have a proper payment id
          from: address,
          value: amount,
          network: chain?.name,
          tokenName: tokenLabel,
          tokenAddress: selectToken(tokenLabel, chainId),
        }).finally(() => {
          setIpfsLoading(false);
        });
        setPath(path);
      } catch (error) {
        console.error(error);
        setBadRequest(true);
        setIpfsLoading(false);
      }
    }
  };

  React.useEffect(() => {
    if (chain) {
      setChainId(chain.network);
    }
  }, [chain]);

  // to refactor the menu item part by using .map
  return (
    <>
      <div className="m-3 flex items-center justify-center">
        <p className="font-medium text-xl">
          Ask anon 🙈 to pay me:
          <input
            className="ml-2 text-gray-500 font-medium text-xl focus:outline-0 focus:text-slate-700 max-w-[65px] bg-transparent"
            type="number"
            placeholder="0.00"
            onChange={handleAmountChange}
          ></input>
        </p>

        <FormControl sx={{ width: "120px" }}>
          <InputLabel>{tokenLabel ? "ERC20" : "Select"}</InputLabel>
          <Select
            value={tokenLabel}
            label="ERC20"
            onChange={handleTokenLabelChange}
            placeholder="Select token"
          >
            {tokensDetails.map((token) => (
              <MenuItem value={token.label}>
                <div className="flex">
                  <Image
                    alt={token.label}
                    src={token.src}
                    width={20}
                    height={20}
                  />
                  <span className="ml-2">{token.label}</span>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="flex justify-center mt-10 mb-3">
        <Button
          className="mt-10 max-w-fit"
          variant="outlined"
          onClick={createRequest}
        >
          {ipfsLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 bg-sky-500"
                viewBox="0 0 24 24"
              ></svg>
              <p>Processing...</p>
            </>
          ) : (
            "Request"
          )}
        </Button>
      </div>

      <div className="flex justify-center mb-3">
        <Share path={path} amount={amount} tokenLabel={tokenLabel} />
      </div>
    </>
  );
}
