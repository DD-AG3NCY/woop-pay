import * as React from "react";
import Link from "@mui/material/Link";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
} from "next-share";
import { useQRCode } from "next-qrcode";
import { baseUrl } from "../../utils/constants";
import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import cx from "classnames";
import Image from "next/image";
import shareImg from "../public/share.svg";
import styles from "./share.module.scss";
import useWindowSize from "../../hooks/useWindowSize/useWindowSize";

const qrCode = new QRCodeStyling({
  width: 357,
  height: 357,
  image: "/O.svg",
  dotsOptions: {
    gradient: {
      type: "linear",
      colorStops: [
        { offset: 0, color: "rgb(6, 34, 92)" },
        { offset: 1, color: "rgba(38, 142, 200, 1)" },
      ],
      rotation: 2.35,
    },
    type: "extra-rounded",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 15,
  },
  backgroundOptions: {
    color: "transparent",
  },
});

export const Share: React.FC<{
  path: string;
  amount: string;
  tokenLabel: string;
  visibility: any;
}> = (props) => {
  const { amount, path, tokenLabel, visibility } = props;
  const [copySuccess, setCopySuccess] = React.useState(false);

  const qrContainer = useRef<any>();
  const { width, height } = useWindowSize();

  useEffect(() => {
    qrCode.append(qrContainer.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: `${baseUrl}${path}`,
      width: width < 361 ? 320 : 357,
      height: width < 361 ? 320 : 357,
    });
  }, [baseUrl, path, width]);

  return (
    <div className="flex flex-col p-2">
      {path ? (
        <div className="">
          <div className="flex justify-center">
            <div ref={qrContainer}></div>
          </div>
          <p className="font-base text-xs font-medium text-slate-500 mt-2">
            Share this payment request:
          </p>
          <div className="mt-2 flex gap-2 place-content-evenly">
            <div
              onClick={() => visibility}
              className={cx(
                styles.buttons,
                "w-full cursor-pointer  font-base focus:outline-0 focus:text-slate-700  h-16 rounded-xl transition-all font-semibold text-slate-500 capitalize hover:border-slate-700 hover:bg-slate-200 hover:text-slate-500 flex items-center justify-center"
              )}>
              {"Back"}{" "}
            </div>
            <div
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: "web.dev",
                      text: "Check out web.dev.",
                      url: "https://web.dev/",
                    })
                    .then(() => console.log("Successful share"))
                    .catch((error) => console.log("Error sharing", error));
                } else {
                  navigator.clipboard.writeText(`${baseUrl}${path}`);
                  setCopySuccess(true);
                  setTimeout(() => {
                    setCopySuccess(false);
                  }, 1000);
                }
              }}
              className={cx(
                styles.buttons,
                "w-full font-base text-sm focus:outline-0 focus:text-slate-700  h-16 rounded-xl transition-all font-semibold text-slate-500 capitalize hover:border-slate-700 hover:bg-slate-200 hover:text-slate-500 flex items-center justify-center"
              )}>
              {!navigator.share && copySuccess
                ? "Copied"
                : !copySuccess
                ? "Copy Link"
                : "Share"}
            </div>
          </div>
          <div className="flex justify-between mt-3">
            <section className="flex items-center">
              <p className="font-base text-xs font-medium text-slate-500 mr-1 ml-1">
                Or share:
              </p>
              <div className="mr-1 flex items-center">
                <WhatsappShareButton
                  url={`${baseUrl}${path}`}
                  title={`Hey!, you've been ask for a WOOP of ${amount} ${tokenLabel} `}>
                  <WhatsappIcon size={15} round />
                </WhatsappShareButton>
              </div>
              <div className="mr-1 flex items-center">
                <TelegramShareButton
                  url={`${baseUrl}${path}`}
                  title={`Hey!, you've been ask for a WOOP of ${amount} ${tokenLabel}`}>
                  <TelegramIcon size={15} round />
                </TelegramShareButton>
              </div>
              <div className="mr-1 flex items-center">
                <TwitterShareButton
                  url={`${baseUrl}${path}`}
                  title={`Hey!, you've been ask for a WOOP of ${amount} ${tokenLabel}`}>
                  <TwitterIcon size={15} round />
                </TwitterShareButton>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <h2></h2>
      )}
    </div>
  );
};
