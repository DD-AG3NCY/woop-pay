import * as React from "react";
import Link from "@mui/material/Link";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from "next-share";
import { useQRCode } from "next-qrcode";
import { baseUrl } from "../../utils/constants";

export const Share: React.FC<{
  path: string;
  amount: string;
  tokenLabel: string;
}> = (props) => {
  const { amount, path, tokenLabel } = props;
  const [copySuccess, setCopySuccess] = React.useState(false);
  const { Canvas } = useQRCode();

  return (
    <div className="container flex flex-col  items-center">
      {path ? (
        <div className="mt-20">
          <div>
            <Canvas
              text={`${baseUrl}${path}`}
              options={{
                level: "M",
                margin: 3,
                scale: 6,
                width: 400,
                color: {
                  dark: "#010599FF",
                  light: "#FFF2DF",
                },
              }}
            />
          </div>
          <p className="mt-10 font-medium text-xl">
            Share this payment request:
          </p>
          <div className="mt-5 grid grid-cols-3 gap-8 place-content-evenly">
            <div>
              <WhatsappShareButton
                url={`${baseUrl}${path}`}
                title={`Hey, can you please pay me ${amount} ${tokenLabel}`}
                separator=":: "
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
            <div>
              <TelegramShareButton
                url={`${baseUrl}${path}`}
                title={`Hey, can you please pay me ${amount} ${tokenLabel}`}
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>
            </div>
            <div>
              <Link
                onClick={() => {
                  navigator.clipboard.writeText(`${baseUrl}${path}`);
                  setCopySuccess(true);
                }}
              >
                {copySuccess ? "Copied" : "Copy Link"}
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <h2></h2>
      )}
    </div>
  );
};
