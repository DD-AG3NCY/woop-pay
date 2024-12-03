import * as React from "react";
import { AiOutlineCopy, AiOutlineClose, AiFillLike } from 'react-icons/ai';
import { retrieveNotifications } from "../../utils/push";
import { useAccount } from 'wagmi';
import Link from "next/link";

interface NotificationProps {
  woopId: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NotificationItem {
  title: string;
  notification: {
    body: string;
  };
  message: string;
  cta: string;
}

export default function Notification(props: NotificationProps) {
  const { woopId, setShowModal } = props;

  const { address } = useAccount();

  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    []
  );
  const [linkCopied, setLinkCopied] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (woopId && address) {
      const retrieveData = async () => {
        try {
          const data = await retrieveNotifications(address);
          console.log('Notifications => ', data);
          setNotifications(data);
        } catch (error) {
          console.error('Failed to retrieve notifications', error);
        }
      };

      retrieveData();
    }
  }, [woopId, address]);

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter(
      (notification) =>
        notification.title === 'Woop Payment Received' &&
        notification.notification.body === woopId
    );
  }, [notifications, woopId]);

  const copyToClipboard = () => {
    if (navigator && navigator.clipboard) {
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
          console.error('Failed to copy text');
        });
    } else {
      console.error('Clipboard not available');
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-indigo-500 to-teal-600 overflow-auto shadow rounded-xl  pb-2">
        <div className="border-collapse">
          <div className="text-white border-b-2 py-4 px-4 mb-5">
            <p className="pl-2">{`${filteredNotifications.length}x confirmed 💵`}</p>
          </div>
          <div className="px-6 h-full">
            <div className="h-full">
              {filteredNotifications.map((notification, index) => (
                <Link
                  href={notification.cta}
                  key={`${notification.title}-${notification.notification.body}-${index}`}
                  className="flex w-full font-base text-sm text-slate-700 px-4 py-3 rounded-lg bg-slate-50 transition-colors cursor-pointer hover:bg-slate-100 mt-3 mb-3"
                >
                  {notification.message}
                </Link>
              ))}
            </div>
          </div>
          <div className="font-bold text-white py-4 px-4 flex justify-center">
            <button
              type="button"
              onClick={copyToClipboard}
              className="p-2 mr-5 border flex items-center rounded-lg bg-white text-gray-800 hover:bg-gray-200 transition-shadow shadow-sm"
            >
              {linkCopied ? 'Copied' : 'Copy Link'}
              {linkCopied ? (
                <AiFillLike className="ml-2" />
              ) : (
                <AiOutlineCopy className="ml-2" />
              )}
            </button>

            <button
              type="button"
              className="p-2 border flex items-center rounded-lg bg-white text-gray-800 hover:bg-gray-200 transition-shadow shadow-sm"
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
