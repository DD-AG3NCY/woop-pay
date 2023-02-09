import * as React from "react";
import { retrieveNotifications } from "../../utils/push";
import { useAccount } from "wagmi";
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
        Click
      </button>
      {showModal && (
        <div className={styles.notificationModal}>
          <table className={styles.notificationTable}>
            <thead>
              <tr>
                <th>Woop Pay Notifications</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification: any, index: any) => (
                <tr key={index} className={styles.notificationRow}>
                  <td>
                    {notification?.title}: {notification?.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
