import Image from "next/image";
import logo from "../public/web3-pay-logo.png";
import Wallet from "../components/Wallet";
import PaymentRequest from "../components/PaymentRequest";

export default function Home() {
  return (
    <>
      <div className="flex justify-center mt-20">
        <Image
          alt="Picture of the author"
          src={logo}
          width={200}
          height={200}
        />
      </div>

      <Wallet />
      <PaymentRequest />
    </>
  );
}
