import * as React from "react";
import Image from "next/image";
import {
  retrieveNotifications,
  retrieveSubscriptions,
  optIn,
  optOut,
} from "../../utils/push";
import { useAccount, useSigner } from "wagmi";
import { pushUrl } from "../../utils/constants";
import styles from "./notification.module.scss";
import cx from "classnames";
import bellCrossedIcon from "../../public/bell-close.svg";
import bellIcon from "../../public/bell-open.svg";
import Link from "next/link";

export default function Notification() {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [notifications, setNotifications] = React.useState<any>([]);

  const retrieveData = async () => {
    const data = await retrieveNotifications(address);
    console.log("Notifications => ", data);
    setNotifications(data);
  };

  const retrieveIsSubscribed = async () => {
    const subs = await retrieveSubscriptions(address);
    setIsSubscribed(subs);
  };

  const activateNotifications = async () => {
    const res: any = await optIn(address, signer);
    if (res) {
      setIsSubscribed(true);
    }
  };

  const disableNotifications = async () => {
    const res: any = await optOut(address, signer);
    if (res) {
      setIsSubscribed(false);
    }
  };

  React.useEffect(() => {
    if (showModal) {
      retrieveData();
    }
  }, [showModal]);

  React.useEffect(() => {
    if (address) {
      retrieveIsSubscribed();
    }
  }, [address]);

  return (
    <div className={cx(styles.notificationContainer, "z-30")}>
      <button
        type="button"
        className={cx(
          styles.notificationButton,
          "flex items-center justify-center shadow-lg"
        )}
        onClick={() => setShowModal(!showModal)}>
        <Image
          alt="Notification"
          src="/notification-bell.svg"
          width={20}
          height={20}
        />
      </button>
      {showModal && (
        <div className={cx(styles.notificationModal, "shadow rounded-3xl")}>
          <div className={styles.notificationTable}>
            <div className="font-bold text-slate-500 border-b-2 border-slate-300 py-4 px-4 font-base text-xl mb-5 flex justify-between items-center">
              <p className="pl-2">Received Woops</p>
              <div className="text-center">
                {isSubscribed ? (
                  <button
                    type="button"
                    className={
                      "p-2 border-slate-500 border hover:bg-slate-100 bg-white cursor:pointer rounded-xl transi"
                    }
                    onClick={() => disableNotifications()}>
                    <Image
                      src={bellCrossedIcon}
                      width={20}
                      height={20}
                      alt="bell-close"
                    />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={cx(
                      styles.notificationOptButton,
                      "transition-colors"
                    )}
                    onClick={() => activateNotifications()}>
                    <Image src={bellIcon} width={20} height={20} alt="bell" />
                  </button>
                )}
              </div>
            </div>
            <div className="px-6">
              {/* TODO: Set page for notification listing */}
              <Link
                href="/notifications"
                className="text-slate-600 text-sm underline mb-2">
                {"See more (" + notifications.length + ")"}
              </Link>
              {notifications
                .slice(0, 3)
                .map((notification: any, index: any) => (
                  /* TODO: Set tx of woop */
                  <Link
                    href="https://etherescan.com/"
                    key={index}
                    className="flex w-full font-base text-sm text-slate-700 px-4 py-3 rounded-lg bg-slate-100 mt-3">
                    {notification?.message}
                  </Link>
                ))}
            </div>
          </div>
          <div className="font-medium font-base text-sm text-white mt-2 text-center">
            {"More notifications?"} <a href={pushUrl}>Check here</a>
          </div>
        </div>
      )}
    </div>
  );
}
