import * as React from "react";
import { retrieveNotifications } from "../../utils/push";
import { useAccount } from 'wagmi';
import Box from '@mui/material/Box';
import Footer from "../../components/Footer";
import Header from "../../components/Heading";
import SEO from "../../components/Seo";
import Notification from "../../components/Notification/Notification";
import Layout from '../../components/Layout';

const Dashboard = () => {
  const [currentModal, setCurrentModal] = React.useState<any>(null);
  const [currentWoopId, setCurrentWoopId] = React.useState<string>('');
  const [currentDescription, setCurrentDescription] =
    React.useState<string>('');
  const [currentAmount, setCurrentAmount] = React.useState<string>('');
  const [currentToken, setCurrentToken] = React.useState<string>('');
  const { address } = useAccount();
  const [notifications, setNotifications] = React.useState<any>([]);

  const retrieveData = async () => {
    const data = await retrieveNotifications(address);
    console.log('Notifications => ', data);
    setNotifications(data);
  };

  const filteredNotifications = notifications.filter(
    (notification: any) => notification?.title === 'Woop Payment Requested'
  );

  React.useEffect(() => {
    retrieveData();
  }, []);

  React.useEffect(() => {
    if (address) {
      retrieveData();
    }
  }, [address]);

  return (
    <Layout>
      <SEO
        title={'Woop Pay | My Woops'}
        rrssImg="./RRSS.png"
        description={'The list of Woop payments requested and received'}
      />

      <div className="flex flex-col items-center mx-3">
        {filteredNotifications.length === 0 ? (
          <p className="m-2">😞 No woops found</p>
        ) : (
          notifications
            .filter(
              (notification: any) =>
                notification?.title === 'Woop Payment Requested'
            )
            .map((notification: any, index: any) => {
              const bodyParts = notification?.message.split(' ');
              const date = [bodyParts[0], bodyParts[1], bodyParts[2]].join(' ');
              const networkName = bodyParts[11];
              const tokenName = bodyParts[8];
              const amount = bodyParts[7];
              const description = bodyParts.slice(13).join(' ');

              return (
                <Box
                  key={index}
                  component="form"
                  className="relative p-4 mt-3 w-full md:w-2/5 rounded-3xl shadow-md bg-gradient-to-r from-blue to-darkBlue border border-lightBlue"
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
                          type="button"
                          className="h-10 px-4 py-2 text-sm font-bold text-slate-700 bg-white border rounded-xl transition-all focus:outline-none focus:text-slate-700"
                          onClick={() => {
                            setCurrentModal(index);
                            setCurrentWoopId(notification?.notification.body);
                            setCurrentAmount(amount);
                            setCurrentDescription(description);
                            setCurrentToken(tokenName);
                          }}
                        >
                          <p className="m-2">💵 Check payments</p>
                        </button>
                      )}
                    </div>
                  </section>
                  {currentModal === index ? (
                    <Notification
                      woopId={currentWoopId}
                      description={currentDescription}
                      amount={currentAmount}
                      tokenName={currentToken}
                      setShowModal={setCurrentModal}
                    />
                  ) : (
                    <></>
                  )}
                </Box>
              );
            })
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
