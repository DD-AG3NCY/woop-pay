import { retrieveNotifications } from "../../utils/push"
import { useAccount } from "wagmi";

export default function Notification() {


    const { address } = useAccount();

    return (
        <div>
            <button type="button" onClick={() => retrieveNotifications(address)}>
                See Notifications
            </button>
        </div>
    )
}