import * as React from "react";
import Image from "next/image";
import { retrieveNotifications } from "../../utils/push";
import { useAccount } from "wagmi";
import { pushUrl } from "../../utils/constants";
import styles from "./notification.module.scss";

export default function Notification() {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const { address } = useAccount();
  const [notifications, setNotifications] = React.useState<any>([]);

  const retrieveData = async () => {
    const data = await retrieveNotifications(address);
    setNotifications(data);
  };

  React.useEffect(() => {
    if (showModal) {
      retrieveData();
    }
  }, [showModal]);

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
            <tbody>
              {notifications
                .slice(0, 3)
                .map((notification: any, index: any) => (
                  <tr key={index} className={styles.notificationRow}>
                    <td className="font-medium font-base text-sm text-white">
                      {notification?.message}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="font-medium font-base text-sm text-white mt-2 text-center">
            {"More notifications?"} <a href={pushUrl}>Check here</a>
          </div>
          <div>
            <button type="button" className={styles.notificationOptButton}>
              Opt-in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
