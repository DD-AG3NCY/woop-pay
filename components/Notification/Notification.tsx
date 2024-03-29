import * as React from "react";
import {
  AiOutlineCopy,
  AiOutlineClose,
  AiFillLike,
  AiFillCaretDown,
} from "react-icons/ai";
import { retrieveNotifications } from "../../utils/push";
import { useAccount } from "wagmi";
import styles from "./notification.module.scss";
import cx from "classnames";
import Link from "next/link";

export default function Notification(props: any) {
  const { woopId, description, amount, tokenName, setShowModal } = props;
  const { address } = useAccount();
  const [notifications, setNotifications] = React.useState<any>([]);
  const [linkCopied, setLinkCopied] = React.useState<boolean>(false);

  const retrieveData = async () => {
    const data = await retrieveNotifications(address);
    console.log("Notifications => ", data);
    setNotifications(data);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(`https://www.wooppay.xyz/woop/${woopId}`)
      .then(() => {
        setLinkCopied(true);

        // Reset the button text after a few seconds
        setTimeout(() => {
          setLinkCopied(false);
        }, 3000); // 3 seconds
      })
      .catch(() => {
        // Handle case where copying fails
        console.error("Failed to copy text");
      });
  };

  React.useEffect(() => {
    if (woopId) {
      retrieveData();
    }
  }, [woopId]);

  return (
    <div className="z-30">
      <div
        className={cx(styles.notificationModal, "shadow rounded-xl z-30 pb-2")}
      >
        <div className={cx(styles.notificationTable)}>
          <div className="text-white border-b-2 py-4 px-4 mb-5">
            <p className="pl-2">{`${
              notifications.filter(
                (notification: any) =>
                  notification?.title === "Woop Payment Received" &&
                  notification?.notification.body === `${woopId}`
              ).length
            }x confirmed 💵`}</p>
          </div>
          {
            <div className="px-6 h-full">
              <div className="h-full">
                {notifications
                  .filter(
                    (notification: any) =>
                      notification?.title === "Woop Payment Received" &&
                      notification?.notification.body === `${woopId}`
                  )
                  .map((notification: any, index: any) => (
                    <Link
                      href={notification?.cta}
                      key={index}
                      className="flex w-full font-base text-sm text-slate-700 px-4 py-3 rounded-lg bg-slate-50 transition-colors cursor-pointer hover:bg-slate-100 mt-3 mb-3"
                    >
                      {notification?.message}
                    </Link>
                  ))}
              </div>
            </div>
          }
          <div className="font-bold text-white py-4 px-4 font-base flex justify-center">
            <button
              type="button"
              onClick={copyToClipboard}
              className="p-2 mr-5 border flex items-center rounded-xl"
            >
              {linkCopied ? "Copied" : "Copy Link"}
              {linkCopied ? (
                <AiFillLike className="ml-2" />
              ) : (
                <AiOutlineCopy className="ml-2" />
              )}
            </button>

            <button
              type="button"
              className="p-2 border flex items-center rounded-xl"
              onClick={() => {
                setShowModal(false);
              }}
            >
              Close
              <AiOutlineClose className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
