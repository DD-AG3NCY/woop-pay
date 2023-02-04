import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const Pkey = `0x${process.env.PK}`;
const signer = new ethers.Wallet(Pkey);

export const sendNotification = async() => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: `[SDK-TEST] notification TITLE:`,
        body: `[sdk-test] notification BODY`
      },
      payload: {
        title: `[sdk-test] payload title`,
        body: `sample msg body`,
        cta: '',
        img: ''
      },
      recipients: 'eip155:5:0xBC3F74CECF1fA8270A6FAE935e974a5a9570D054', // recipient address
      channel: 'eip155:5:0x338EF19fA2eC0fc4d1277B1307a613fA1FBbc0cb', // your channel address
      env: 'staging'
    });
    
    // apiResponse?.status === 204, if sent successfully!
    console.log('API repsonse: ', apiResponse);
  } catch (err) {
    console.error('Error: ', err);
  }
}