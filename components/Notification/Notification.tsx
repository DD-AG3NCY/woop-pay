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

export default function Notification() {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [notifications, setNotifications] = React.useState<any>([]);

  const retrieveData = async () => {
    const data = await retrieveNotifications(address);
    console.log(data);
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
    <div className={styles.notificationContainer}>
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
        <div className={styles.notificationModal}>
          <div className={styles.notificationTable}>
            <div className="font-semibold font-base text-lg text-slate-600 mb-5">
              Your woops
            </div>
            <div>
              {notifications
                .slice(0, 3)
                .map((notification: any, index: any) => (
                  <div
                    key={index}
                    className="font-base text-sm text-slate-700 pt-2">
                    · {notification?.message}
                  </div>
                ))}
            </div>
          </div>
          <div className="font-medium font-base text-sm text-white mt-2 text-center">
            {"More notifications?"} <a href={pushUrl}>Check here</a>
          </div>
          {/*           <div className="text-center mt-2">
            {isSubscribed ? (
              <button
                type="button"
                className={styles.notificationOptButton}
                onClick={() => disableNotifications()}>
                Disable Notifications
              </button>
            ) : (
              <button
                type="button"
                className={styles.notificationOptButton}
                onClick={() => activateNotifications()}>
                Enable Notifications
              </button>
            )}
          </div> */}
        </div>
      )}
    </div>
  );
}
