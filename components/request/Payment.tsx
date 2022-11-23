import * as React from "react";
import { Share } from "./Share";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

import { useAccount } from "wagmi";
import { uploadIpfs } from "../../utils/ipfs";
import { selectToken } from "../../utils/constants";

import Image from "next/image";
import wethLogo from "../../public/weth.png";
import daiLogo from "../../public/dai.png";
import usdcLogo from "../../public/usdc.png";

export default function Payment() {
  const [tokenLabel, setTokenLabel] = React.useState("");
  const [amount, setAmount] = React.useState<string>("");
  const [path, setPath] = React.useState<string>("");
  const [ipfsLoading, setIpfsLoading] = React.useState<boolean>(false);
  const { address } = useAccount();

  //event handlers
  const handleTokenLabelChange = (event: SelectChangeEvent) => {
    setTokenLabel(event.target.value as string);
  };

  const handleAmountChange = (event: any) => {
    setAmount(event.target.value as string);
  };

  //main functions
  const createRequest = async () => {
    try {
      setIpfsLoading(true);
      const { path } = await uploadIpfs({
        version: "1.0.0",
        // metadata_id: uuid(), can be used in the future to have a proper payment id
        from: address,
        value: amount,
        tokenName: tokenLabel,
        tokenAddress: selectToken(tokenLabel)?.contractAddress,
      }).finally(() => {
        setIpfsLoading(false);
      });
      setPath(path);
    } catch (error) {
      console.error(error);
      setIpfsLoading(false);
    }
  };

  // to refactor the menu item part by using .map
  return (
    <>
      <div className="m-3 flex items-center justify-center">
        <p className="font-medium text-xl">
          Ask anon 🙈 to pay me
          <input
            className="ml-2 text-gray-500 font-medium text-xl focus:outline-0 focus:text-gray-500 max-w-[65px]"
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
            <MenuItem value="DAI">
              <div className="flex">
                <Image alt="DAI" src={daiLogo} width={20} height={20} />
                <span className="ml-2">DAI</span>
              </div>
            </MenuItem>
            <MenuItem value="USDC">
              <div className="flex">
                <Image alt="USDC" src={usdcLogo} width={20} height={20} />
                <span className="ml-2">USDC</span>
              </div>
            </MenuItem>
            <MenuItem value="WETH">
              <div className="flex">
                <Image alt="WETH" src={wethLogo} width={20} height={10} />
                <span className="ml-2">WETH</span>
              </div>
            </MenuItem>
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

      <div className="flex justify-center">
        <Share path={path} amount={amount} tokenLabel={tokenLabel} />
      </div>
    </>
  );
}
