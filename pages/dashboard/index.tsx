import * as React from "react";
import { retrieveNotifications } from "../../utils/push";
import { useAccount } from 'wagmi';
import Box from '@mui/material/Box';
import SEO from '../../components/Seo';
import Notification from '../../components/Notification/Notification';
import Layout from '../../components/Layout';

interface NotificationItem {
  title: string;
  notification: {
    body: string;
  };
  message: string;
}

const Dashboard = () => {
  const [currentModal, setCurrentModal] = React.useState<any>(null);
  const [currentWoopId, setCurrentWoopId] = React.useState<string>('');
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    []
  );

  const { address } = useAccount();

  const retrieveData = async () => {
    if (!address) return;
    try {
      const data = await retrieveNotifications(address);
      console.log('Notifications => ', data);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to retrieve notifications', error);
    }
  };

  React.useEffect(() => {
    retrieveData();
  }, [address]);

  const filteredNotifications = React.useMemo(() => {
    return notifications.filter(
      (notification) => notification.title === 'Woop Payment Requested'
    );
  }, [notifications]);

  return (
    <Layout>
      <SEO
        title={'Woop Pay | My Woops'}
        rrssImg="./RRSS.png"
        description={'The list of Woop payments requested and received'}
      />

      <div className="flex flex-col items-center mx-3 w-full">
        {filteredNotifications.length === 0 ? (
          <p className="m-2">😞 No woops found</p>
        ) : (
          notifications
            .filter(
              (notification) => notification.title === 'Woop Payment Requested'
            )
            .map((notification, index) => {
              const bodyParts = notification.message.split(' ');
              const date = [bodyParts[0], bodyParts[1], bodyParts[2]].join(' ');
              const networkName = bodyParts[11];
              const tokenName = bodyParts[8];
              const amount = bodyParts[7];
              const description = bodyParts.slice(13).join(' ');

              return (
                <div
                  key={notification.notification.body}
                  className="relative p-4 mt-3 w-full md:w-2/5 rounded-3xl shadow-md bg-secondary-gradient border-lightBlue text-white"
                >
                  <section className="text-center">
                    <div className="flex justify-between w-full">
                      <p className="ml-2 text-sm">{networkName} 🌐</p>
                      <p className="mr-2 text-sm">{date} ⌚</p>
                    </div>
                    <div className="ml-2 flex justify-center">
                      <p className="text-[55px] font-bold">
                        {amount == 'allowPayerSelectAmount' ? 'n/a' : amount}{' '}
                        {tokenName}
                      </p>
                    </div>
                    <div className="m-2 text-base">
                      <p>{description}</p>
                    </div>
                    <div className="m-2 flex justify-center">
                      {currentModal === index ? (
                        <></>
                      ) : (
                        <button
                          className="h-10 px-4 py-2 text-sm font-bold text-slate-700 bg-white border rounded-xl transition-all focus:outline-none focus:text-slate-700"
                          onClick={() => {
                            setCurrentModal(index);
                            setCurrentWoopId(notification?.notification.body);
                          }}
                        >
                          <p>💵 Check payments</p>
                        </button>
                      )}
                    </div>
                  </section>
                  {currentModal === index ? (
                    <Notification
                      woopId={currentWoopId}
                      setShowModal={setCurrentModal}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              );
            })
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
