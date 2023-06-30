import * as React from "react";
import { AiFillFolderOpen } from "react-icons/ai";
import {
  retrieveNotifications,
  retrieveSubscriptions,
  optIn,
  optOut,
} from "../../utils/push";
import { useAccount, useSigner, useNetwork } from "wagmi";
import styles from "./dashboard.module.scss";
import cx from "classnames";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Heading";
import ErrorsUi from "../../components/ErrorsUi/ErrorsUi";
import SEO from "../../components/Seo";
import Notification from "../../components/Notification/Notification";

const Dashboard = () => {
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const [isMainnet, setIsMainnet] = React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [currentWoopId, setCurrentWoopId] = React.useState<string>("");
  const [currentDescription, setCurrentDescription] =
    React.useState<string>("");
  const [currentAmount, setCurrentAmount] = React.useState<string>("");
  const [currentToken, setCurrentToken] = React.useState<string>("");
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const [notifications, setNotifications] = React.useState<any>([]);

  const retrieveData = async () => {
    const data = await retrieveNotifications(address);
    console.log("Notifications => ", data);
    setNotifications(data);
  };

  const retrieveIsSubscribed = async () => {
    const subs = await retrieveSubscriptions(address);
    console.log(subs);
    setIsSubscribed(subs);
  };

  const activateNotifications = async () => {
    const res: any = await optIn(address, signer);
    if (res) {
      setIsSubscribed(true);
    }
  };

  //   const disableNotifications = async () => {
  //     const res: any = await optOut(address, signer);
  //     if (res) {
  //       setIsSubscribed(false);
  //     }
  //   };

  React.useEffect(() => {
    if (chain?.network == "homestead") {
      setIsMainnet(true);
    } else {
      setIsMainnet(false);
    }

    retrieveIsSubscribed();
    retrieveData();
  }, []);

  React.useEffect(() => {
    if (address) {
      retrieveIsSubscribed();
      retrieveData();
    }
  }, [address]);

  return (
    <div className="flex flex-col items-center justify-center">
      <SEO
        title={"Woop Pay | My Woops"}
        rrssImg="./RRSS.png"
        description={"The list of Woop payments requested and received"}
      />

      <Header />

      <article
        className={cx(
          styles.baseContainer,
          "h-screen w-full flex justify-center items-center"
        )}
      >
        <section
          className={cx(
            styles.containerBase,
            "h-screen w-full absolute top-0 z-0 flex opacity-50 items-center"
          )}
        ></section>

        {/* CONTENT */}
        {/* <Container>
          <Box
            component="form"
            className={cx(
              styles.containerBox,
              "rounded-3xl shadow-md w-full relative z-20"
            )}
          >
            {showModal ? (
              <Notification
                woopId={currentWoopId}
                description={currentDescription}
                amount={currentAmount}
                tokenName={currentToken}
                setShowModal={setShowModal}
              />
            ) : (
              <></>
            )}
            <section className="justify-items-left font-base text-white">
              <div
                className={cx(
                  styles.topContainer,
                  "mb-2 pl-4 pr-4 pt-4 pb-3 w-full flex justify-between items-center"
                )}
              >
                <p className="font-base font-bold text-xl">{`My Woops 📜`}</p>
              </div>
              <div className="px-4 pb-4 pt-1 relative">
                <div>
                  <div className="sm:overflow-x-visible overflow-x-auto">
                    {isSubscribed ? (
                      <table className="table-auto w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-black bg-white rounded-l-lg">
                              Date (UTC)
                            </th>
                            <th className="px-4 py-2 text-left text-black bg-white">
                              Description
                            </th>
                            <th className="px-4 py-2 text-left text-black bg-white">
                              Network
                            </th>
                            <th className="px-4 py-2 text-left text-black bg-white">
                              Amount
                            </th>
                            <th className="px-4 py-2 text-left text-black bg-white rounded-r-lg">
                              Payments
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {notifications.length == 0 ? (
                            <p className="m-2">No woops found</p>
                          ) : (
                            notifications
                              .filter(
                                (notification: any) =>
                                  notification?.title ===
                                  "Woop Payment Requested"
                              )
                              .map((notification: any, index: any) => {
                                const bodyParts =
                                  notification?.message.split(" ");
                                const date = bodyParts[0];
                                const time = bodyParts[1];
                                const networkName = bodyParts[9];
                                const tokenName = bodyParts[6];
                                const amount = bodyParts[5];
                                const description = bodyParts
                                  .slice(11)
                                  .join(" ");

                                return (
                                  <tr key={index}>
                                    <td className="px-4 py-2">{`${date} ${time}`}</td>
                                    <td className="px-4 py-2">
                                      {description !== ""
                                        ? description
                                        : "Payment request"}
                                    </td>
                                    <td className="px-4 py-2">{networkName}</td>
                                    <td className="px-4 py-2">{`${
                                      amount !== "allowPayerSelectAmount"
                                        ? amount
                                        : "(User-Selected)"
                                    } ${tokenName}`}</td>
                                    <td className="px-4 py-2">
                                      {" "}
                                      <button
                                        type="button"
                                        className="flex items-center justify-center"
                                        onClick={() => {
                                          setShowModal(true);
                                          setCurrentWoopId(
                                            notification?.notification.body
                                          );
                                          setCurrentAmount(amount);
                                          setCurrentDescription(description);
                                          setCurrentToken(tokenName);
                                        }}
                                      >
                                        Show details
                                        <AiFillFolderOpen className="ml-2" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <p>
                        {`To enable your dashboard, you need to activate your
                        notifications by clicking `}
                        <button
                          onClick={activateNotifications}
                          type="button"
                          style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          here
                        </button>
                        .
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </Box>{" "}
        </Container> */}
        <Container className="flex flex-col items-center justify-center">
          <div className="md:w-2/3 lg:w-1/2">
            <Box
              component="form"
              className={cx(
                styles.containerBoxNew,
                "rounded-3xl shadow-md w-full relative z-20 flex flex-col justify-center items-center p-4"
              )}
            >
              <section className="text-center">
                <div className="flex justify-between w-full">
                  <p className="ml-2 text-xs">Network: Goerli</p>
                  <p className="mr-2 text-xs">25th July 2023</p>
                </div>
                <div className="ml-2 flex">
                  <p className="text-[55px] bold">5 ETH</p>
                </div>
                <div className="m-2 text-base">
                  <p>This is a description for thea</p>
                </div>
                <div className="m-2">
                  <button
                    type="button"
                    className="flex justify-center items-center border-white border font-base focus:outline-0 focus:text-slate-700 w-full h-10 rounded-xl transition-all font-bold text-white hover:border-white hover:bg-white hover:text-slate-700 mt-3"
                  >
                    Check Payment
                  </button>
                </div>
              </section>
            </Box>
          </div>

          <div className="md:w-2/3 lg:w-1/2 mt-3">
            <Box
              component="form"
              className={cx(
                styles.containerBoxNew,
                "rounded-3xl shadow-md w-full relative z-20 flex flex-col justify-center items-center p-4"
              )}
            >
              <section className="text-center">
                <div className="flex justify-between w-full">
                  <p>25-06-2023</p>
                  <p>5 ETH</p>
                  <p>Goerli</p>
                </div>
                <div className="m-2">
                  <p>This is a description for the payment</p>
                </div>
                <div className="m-2">
                  <p>Payment details</p>
                </div>
              </section>
            </Box>
          </div>

          <div className="md:w-2/3 lg:w-1/2 mt-3">
            <Box
              component="form"
              className={cx(
                styles.containerBoxNew,
                "rounded-3xl shadow-md w-full relative z-20 flex flex-col justify-center items-center p-4"
              )}
            >
              <section className="text-center">
                <div className="flex justify-between w-full">
                  <p>25-06-2023</p>
                  <p>5 ETH</p>
                  <p>Goerli</p>
                </div>
                <div className="m-2">
                  <p>This is a description for the payment</p>
                </div>
                <div className="m-2">
                  <p>Payment details</p>
                </div>
              </section>
            </Box>
          </div>
        </Container>
      </article>

      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
