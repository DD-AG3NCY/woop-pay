import * as React from "react";
import Image from "next/image";
import {
  retrieveNotifications,
  retrieveSubscriptions,
  optIn,
  optOut,
} from "../../utils/push";
import { useAccount, useSigner, useNetwork } from "wagmi";
import styles from "./dashboard.module.scss";
import cx from "classnames";
import Link from "next/link";
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
    }
  }, [address]);

  return (
    <div>
      <SEO
        title={"Woop Pay | My Woop Payments"}
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
        <Container maxWidth="lg">
          <div className={"mb-2 z-20"}>
            <ErrorsUi errorMsg={"hello"} errorNtk={"hello"} />
          </div>

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
                  {/* {notifications.map((notification: any, index: any) => (
                    <Link href={notification?.notification?.body} key={index}>
                      {notification?.message}
                    </Link>
                  ))} */}
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
                      {notifications
                        .filter(
                          (notification: any) =>
                            notification?.title === "Woop Payment Requested"
                        )
                        .map((notification: any, index: any) => {
                          const bodyParts = notification?.message.split(" ");
                          const date = bodyParts[0];
                          const time = bodyParts[1];
                          const networkName = bodyParts[9];
                          const tokenName = bodyParts[6];
                          const amount = bodyParts[5];
                          const description = bodyParts.slice(11).join(" ");

                          return (
                            <tr key={index}>
                              <td className="px-4 py-2">{`${date} ${time}`}</td>
                              <td className="px-4 py-2">{description}</td>
                              <td className="px-4 py-2">{networkName}</td>
                              <td className="px-4 py-2">{`${amount} ${tokenName}`}</td>
                              <td className="px-4 py-2 ">
                                {" "}
                                <button
                                  type="button"
                                  className="flex items-center justify-center shadow-lg"
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
                                  Show details 👀
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </Box>
        </Container>
      </article>

      <div className="absolute bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
