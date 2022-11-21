import * as React from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import ERC20 from "../../abi/ERC20.abi.json";
import Wallet from "../../components/Wallet";
import { utils } from "ethers";

interface Request {
  version: string;
  from: string;
  value: string;
  tokenName: string;
  tokenAddress: string;
}

const Request = () => {
  const [request, setRequest] = React.useState<Request>();
  const [amount, setAmount] = React.useState<string>("0.1");
  const router = useRouter();
  const { id } = router.query;

  const callIpfs = async () => {
    try {
      const response = await fetch(
        `https://web3-pay.infura-ipfs.io/ipfs/${id}`
      );

      if (!response.ok) throw new Error(response.statusText);

      const json = await response.json();
      setRequest(json);
      setAmount(json.value);
      //console.log(json);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (id) {
      callIpfs();
    }
  }, [id]);

  // wagmi transaction
  const { config } = usePrepareContractWrite({
    address: request?.tokenAddress,
    abi: ERC20,
    functionName: "transfer",
    args: [request?.from, utils.parseEther(amount)],
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <Wallet />
      <p>Request Id: {id}</p>

      <div>
        There is a payment request from {request?.from} of {request?.value}{" "}
        {request?.tokenName}
      </div>
      <Button
        sx={{ minWidth: 120, maxHeight: 50 }}
        variant="outlined"
        disabled={!write || isLoading}
        onClick={() => write?.()}
      >
        Pay
      </Button>
      {isSuccess && (
        <div>
          Payment successful!
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
