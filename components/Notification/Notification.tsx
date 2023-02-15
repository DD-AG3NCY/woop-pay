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

export default function Notification() {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [notifications, setNotifications] = React.useState<any>([]);

  const retrieveData = async () => {
    const data = await retrieveNotifications(address);
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
        className={styles.notificationButton}
        onClick={() => setShowModal(!showModal)}
      >
        <Image
          alt="Notification"
          src="/notification-bell.svg"
          width={35}
          height={40}
        />
      </button>
      {showModal && (
        <div className={styles.notificationModal}>
          <table className={styles.notificationTable}>
            <thead className="font-medium font-base text-sm text-black">
              Latest transactions
            </thead>
            <tbody>
              {notifications
                .slice(0, 3)
                .map((notification: any, index: any) => (
                  <tr key={index} className={styles.notificationRow}>
                    <td className="font-medium font-base text-sm text-black">
                      {notification?.message}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="font-medium font-base text-sm text-white mt-2 text-center">
            {"More notifications?"} <a href={pushUrl}>Check here</a>
          </div>
          <div className="text-center mt-2">
            {isSubscribed ? (
              <button
                type="button"
                className={styles.notificationOptButton}
                onClick={() => disableNotifications()}
              >
                Disable Notifications
              </button>
            ) : (
              <button
                type="button"
                className={styles.notificationOptButton}
                onClick={() => activateNotifications()}
              >
                Enable Notifications
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
