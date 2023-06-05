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
import bellCrossedIcon from "../../public/bell-close.svg";
import bellIcon from "../../public/bell-open.svg";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Footer from "../../components/Footer";
import Header from "../../components/Heading";
import ErrorsUi from "../../components/ErrorsUi/ErrorsUi";
import SEO from "../../components/Seo";

const Dashboard = () => {
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = React.useState<boolean>(false);
  const [isMainnet, setIsMainnet] = React.useState<boolean>(false);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const [notifications, setNotifications] = React.useState<any>([]);
  const modalRef = React.useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

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
            <section className="justify-items-left font-base text-white">
              <div
                className={cx(
                  styles.topContainer,
                  "mb-2 pl-4 pr-4 pt-4 pb-3 w-full flex justify-between items-center"
                )}
              >
                <p className="font-base font-bold text-xl">
                  {`My Woop Payments`}
                </p>
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
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Token</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((notification: any, index: any) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{`test`}</td>
                          <td className="border px-4 py-2">
                            {`notification?.`}
                          </td>
                          <td className="border px-4 py-2">
                            {`notification?.notification?.body?.description`}
                          </td>
                          <td className="border px-4 py-2">
                            {`notification?.notification?.body?.date`}
                          </td>
                        </tr>
                      ))}
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
