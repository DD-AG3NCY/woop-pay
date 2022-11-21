import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useAccount } from "wagmi";
import { uploadIpfs } from "../utils/ipfs";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from "next-share";
import { useQRCode } from "next-qrcode";

export default function PaymentRequest() {
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [amount, setAmount] = React.useState<string>("");
  const [path, setPath] = React.useState<string>("");
  const [ipfsLoading, setIpfsLoading] = React.useState<boolean>(false);
  const [copySuccess, setCopySuccess] = React.useState(false);
  const { address } = useAccount();
  const { Canvas } = useQRCode();

  //event handlers
  const handleTokenAddressChange = (event: SelectChangeEvent) => {
    setTokenAddress(event.target.value as string);
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
        tokenName: "USDC",
        tokenAddress: tokenAddress,
      }).finally(() => {
        setIpfsLoading(false);
      });
      setPath(path);
    } catch (error) {
      console.error(error);
      setIpfsLoading(false);
    }
  };

  return (
    <div className="container flex flex-col  items-center">
      <Box
        component="form"
        className="flex justify-center mt-20"
        sx={{
          p: 2,
          width: 900,
          height: 450,
          border: "2px solid grey",
          borderRadius: 10,
        }}
        noValidate
        autoComplete="off"
      >
        <div className="container flex flex-col  items-center">
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="demo-select-small">Token</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-simple-select"
              value={tokenAddress}
              label="Token"
              onChange={handleTokenAddressChange}
            >
              <MenuItem value={"0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60"}>
                DAI
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            id="outlined-number"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
        <div className="container flex flex-col  items-center">
          <Button
            sx={{ minWidth: 120, maxHeight: 50 }}
            variant="outlined"
            onClick={createRequest}
          >
            {ipfsLoading ? "Loading..." : "Request"}
          </Button>
          {path ? (
            <div>
              {" "}
              <WhatsappShareButton
                url={`http://localhost:3000/request/${path}`}
                title={`Hey, can please pay me ${amount} USDC`}
                separator=":: "
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <TelegramShareButton
                url={`http://localhost:3000/request/${path}`}
                title={`Hey, can please pay me ${amount} USDC`}
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>
              <Link
                //href={`http://localhost:3000/request/${path}`}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `http://localhost:3000/request/${path}`
                  );
                  setCopySuccess(true);
                }}
              >
                {copySuccess ? "Copied" : "Copy Link"}
              </Link>
              <Canvas
                text={`http://localhost:3000/request/${path}`}
                options={{
                  level: "M",
                  margin: 3,
                  scale: 4,
                  width: 200,
                  color: {
                    dark: "#010599FF",
                    light: "#FFBF60FF",
                  },
                }}
              />
            </div>
          ) : (
            <h2>No Link</h2>
          )}
        </div>
      </Box>
    </div>
  );
}
