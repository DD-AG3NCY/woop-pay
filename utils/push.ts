import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const Pkey = `0x${process.env.NEXT_PUBLIC_PK}`;
const signer = new ethers.Wallet(Pkey);
const channelAddress = "0x338EF19fA2eC0fc4d1277B1307a613fA1FBbc0cb";

interface Request {
  version: string;
  from: string;
  value: string;
  decimals: number;
  tokenName: string;
  tokenAddress: string;
}

export const sendNotification = async (
  recipient: string,
  networkName: string,
  request: Request,
  etherscanLink: any
) => {
  try {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toISOString().split("T")[1].split(".")[0];

    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `Woop Payment Received`,
        body: `${etherscanLink}`,
      },
      payload: {
        title: `Woop Payment Received`,
        body: `${date} ${time} (UTC): ${recipient.slice(
          0,
          4
        )}...${recipient.slice(-4)} paid ${request.value} ${
          request.tokenName
        } on network ${networkName}. Thanks for using Woop Pay`,
        cta: "",
        img: "",
      },
      recipients: `eip155:5:${recipient}`, // recipient address
      channel: `eip155:5:${channelAddress}`,
      env: "staging",
    });

    // apiResponse?.status === 204, if sent successfully!
    console.log("API repsonse: ", apiResponse);
  } catch (err) {
    console.error("Error: ", err);
  }
};

export const optIn = async (address: any, signer: any) => {
  await PushAPI.channels.subscribe({
    signer: signer,
    channelAddress: `eip155:5:${channelAddress}`, // channel address in CAIP
    userAddress: `eip155:5:${address}`, // user address in CAIP
    onSuccess: () => {
      console.log("opt in success");
      return true;
    },
    onError: () => {
      console.error("opt in error");
      return false;
    },
    env: "staging",
  });
};

export const optOut = async (address: any, signer: any) => {
  await PushAPI.channels.unsubscribe({
    signer: signer,
    channelAddress: `eip155:5:${channelAddress}`, // channel address in CAIP
    userAddress: `eip155:5:${address}`, // user address in CAIP
    onSuccess: () => {
      console.log("opt out success");
      return true;
    },
    onError: () => {
      console.error("opt out error");
      return false;
    },
    env: "staging",
  });
};

export const retrieveNotifications = async (address: string | undefined) => {
  const notifications = await PushAPI.user.getFeeds({
    user: `eip155:5:${address}`, // user address in CAIP
    env: "staging",
  });

  return notifications;
};

export const retrieveSubscriptions = async (address: string | undefined) => {
  const subscriptions = await PushAPI.user.getSubscriptions({
    user: `eip155:5:${address}`, // user address in CAIP
    env: "staging",
  });

  return subscriptions.some(
    (subscription: any) => subscription["channel"] == channelAddress
  );
};
