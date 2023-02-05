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

export const sendNotification = async (recipient: string, id: any, request: Request) => {
  try {

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toISOString().split('T')[1].split('.')[0];

    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `Woop Payment Received at ${time}`,
        body: `Payment Received`
      },
      payload: {
        title: `Woop Payment Received at ${date} ${time}(UTC)`,
        body: `Good news! ${recipient} has come through and paid ${request.value} ${request.tokenName} you requested using this link https://www.wooppay.xyz/woop/${id}. Thanks for using our platform.`,
        cta: '',
        img: ''
      },
      recipients: `eip155:5:${recipient}`, // recipient address
      channel: 'eip155:5:0x338EF19fA2eC0fc4d1277B1307a613fA1FBbc0cb',
      env: 'staging'
    });
    
    // apiResponse?.status === 204, if sent successfully!
    console.log('API repsonse: ', apiResponse);
  } catch (err) {
    console.error('Error: ', err);
  }
}