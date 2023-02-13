import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const Pkey = `0x${process.env.NEXT_PUBLIC_PK}`;
const signer = new ethers.Wallet(Pkey);

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
  id: any,
  request: Request
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
        body: `Woop Payment Received`,
      },
      payload: {
        title: `Woop Payment Received`,
        body: `${date} ${time} (UTC): ${recipient} paid ${request.value} ${request.tokenName}. Thanks for using Woop Pay.`,
        cta: "",
        img: "",
      },
      recipients: `eip155:5:${recipient}`, // recipient address
      channel: "eip155:5:0x338EF19fA2eC0fc4d1277B1307a613fA1FBbc0cb",
      env: "staging",
    });

    // apiResponse?.status === 204, if sent successfully!
    console.log("API repsonse: ", apiResponse);
  } catch (err) {
    console.error("Error: ", err);
  }
};

export const retrieveNotifications = async (address: string | undefined) => {
  const notifications = await PushAPI.user.getFeeds({
    user: `eip155:5:${address}`, // user address in CAIP
    env: "staging",
  });

  console.log(notifications);

  return notifications;
};
