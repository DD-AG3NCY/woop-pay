import * as React from "react";
import { retrieveNotifications } from "../../utils/push";
import { useAccount } from "wagmi";
import styles from "./notification.module.scss";

export default function Notification() {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const { address } = useAccount();
  const [notifications, setNotifications] = React.useState([]);

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
    <div>
      <button type="button" onClick={() => setShowModal(true)}>
        See Notifications
      </button>
      {showModal && (
        <table className={styles.container}>
          <thead>
            <tr>
              <th>Woop Pay Notifications</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification, index) => (
              <tr key={index}>
                <td>
                  {notification?.title}: {notification?.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
