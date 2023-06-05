import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const Pkey = `0x${process.env.NEXT_PUBLIC_PK}`;
const signer = new ethers.Wallet(Pkey);
const channelAddress = "0x338EF19fA2eC0fc4d1277B1307a613fA1FBbc0cb";
const environment = "prod";
const environmentInteger = "1";

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
  sender: string | undefined,
  networkName: string,
  amount: string,
  description: string,
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
        body: `${date} ${time} (UTC): ${sender?.slice(0, 4)}...${sender?.slice(
          -4
        )} paid ${amount} ${request.tokenName} on network ${networkName}${
          description ? ` for ${description}` : ""
        }`,
        cta: "",
        img: "",
      },
      recipients: `eip155:${environmentInteger}:${recipient}`, // recipient address
      channel: `eip155:${environmentInteger}:${channelAddress}`,
      env: environment,
    });

    // apiResponse?.status === 204, if sent successfully!
    console.log("API repsonse: ", apiResponse);
  } catch (err) {
    console.error("Error: ", err);
  }
};

export const sendNotificationRequest = async (
  sender: string | undefined,
  networkName: string | undefined,
  amount: string,
  description: string,
  tokenName: string | undefined,
  woopId: any
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
        title: `Woop Payment Requested`,
        body: `${woopId}`,
      },
      payload: {
        title: `Woop Payment Requested`,
        body: `${date} ${time} (UTC): ${sender?.slice(0, 4)}...${sender?.slice(
          -4
        )} requested ${amount} ${tokenName} on network ${networkName} for ${description} `,
        cta: "",
        img: "",
      },
      recipients: `eip155:${environmentInteger}:${sender}`, // recipient address
      channel: `eip155:${environmentInteger}:${channelAddress}`,
      env: environment,
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
    channelAddress: `eip155:${environmentInteger}:${channelAddress}`, // channel address in CAIP
    userAddress: `eip155:${environmentInteger}:${address}`, // user address in CAIP
    onSuccess: () => {
      console.log("opt in success");
      return true;
    },
    onError: (error) => {
      console.error(error);
      return false;
    },
    env: environment,
  });
};

export const optOut = async (address: any, signer: any) => {
  await PushAPI.channels.unsubscribe({
    signer: signer,
    channelAddress: `eip155:${environmentInteger}:${channelAddress}`, // channel address in CAIP
    userAddress: `eip155:${environmentInteger}:${address}`, // user address in CAIP
    onSuccess: () => {
      console.log("opt out success");
      return true;
    },
    onError: () => {
      console.error("opt out error");
      return false;
    },
    env: environment,
  });
};

export const retrieveNotifications = async (address: string | undefined) => {
  const notifications = await PushAPI.user.getFeeds({
    user: `eip155:${environmentInteger}:${address}`, // user address in CAIP
    env: environment,
  });

  return notifications;
};

export const retrieveSubscriptions = async (address: string | undefined) => {
  const subscriptions = await PushAPI.user.getSubscriptions({
    user: `eip155:${environmentInteger}:${address}`, // user address in CAIP
    env: environment,
  });

  return subscriptions.some(
    (subscription: any) => subscription["channel"] == channelAddress
  );
};
