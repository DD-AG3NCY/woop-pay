import React, { useState, useEffect } from "react";

type ITermsProps = {};

const defaultProps = {};

const Terms: React.FC<ITermsProps> = (props) => {
  const {} = props;

  useEffect(() => {}, []);

  return (
    <article className="flex justify-center">
      <div className="max-w-lg my-20 p-5 rounded-lg shadow-md">
        <h2 className="text-center font-semibold text-2xl mb-5">
          Woop Pay Terms of Service
        </h2>
        <p className="text-center mb-5">{"Last modified: December 13, 2022"}</p>

        <p className="text-justify mb-5">
          {
            "These Terms of Service explains the terms and conditions by which you can use https://wooppay.xyz. You must read this Agreement carefully as it governs your use of the application. By accessing or using the application, you agree that you have read, understand this Agreement in its entirety. If you do not agree, you are not authorized to access or use the application."
          }
        </p>
        <p className="text-justify mb-5">
          {
            "Woop Pay provides access to transactions on various public blockchains, including but not limited to Ethereum. To access the application, you must use non-custodial wallets. Your relationship with that non-custodial wallet provider is governed by the applicable terms of service of that third party, not this Agreement. Wallets are not operated by, maintained by, or affiliated with us, and we do not have custody or control over the contents of your wallet."
          }
        </p>
        <p className="text-center mb-5">{"Description of Services"}</p>
        <p className="text-justify mb-5">
          {
            "The application is distinct from the underlying network. By using the application, you understand that you are not buying or selling digital assets from us and that we do not operate any control trade execution on the blockchain used."
          }
        </p>
        <p className="text-center mb-5">{"No Investment Advice"}</p>
        <p className="text-justify mb-5">
          {
            "You agree and understand that: (a) all trades you submit through the application are solely initiated by you; and (b) you have not received any investment advice from us in connection with any transaction;"
          }
        </p>
        <p className="text-center mb-5">
          {"Non-Custodial and No Fiduciary Duties"}
        </p>
        <p className="text-justify mb-5">
          {
            "We do not have custody, possession, or control of your digital assets at any time. It further means you are solely responsible for the custody of the cryptographic private keys to the digital asset wallets you hold and you should never share your wallet credentials or seed phrase with anyone. We accept no responsibility for, or liability to you, in connection with your use of a wallet."
          }
        </p>
        <p className="text-center mb-5">{"Compliance"}</p>
        <p className="text-justify mb-5">
          {
            "By accessing or using the application, you agree that you are solely and entirely responsible for compliance with all laws and regulations that may apply to you."
          }
        </p>
        <p className="text-center mb-5">{"Assumption of Risk"}</p>
        <p className="text-justify mb-5">
          {
            "By accessing and using the applicatopn, you understand the risks associated with using blockchain-based systems, and that you have a working knowledge of the usage and intricacies of digital assets such as ether (ETH), so-called stablecoins, and other digital tokens such as those following the Ethereum Token Standard (ERC-20)."
          }
        </p>
        <p className="text-center mb-5">{"Release of Claims"}</p>
        <p className="text-justify mb-5">
          {
            "You assume all risks in connection with your access and use of the application. You further expressly waive and release us from any and all liability, claims, causes of action, or damages arising from or in any way relating to your use of the application."
          }
        </p>
        <p className="text-center mb-5">{"No Warranties"}</p>
        <p className="text-justify mb-5">
          {
            "The application is provided on an AS IS and AS AVAILABLE basis. You acknowledge and agree that your use of the application is at your own risk."
          }
        </p>
        <p className="text-center mb-5">{"Limitation of Liability"}</p>
        <p className="text-justify mb-5">
          {
            "UNDER NO CIRCUMSTANCES SHALL WE BE LIABLE TO YOU FOR ANY INDIRECT DAMAGES, INCLUDING (BUT NOT LIMITED TO) DAMAGES FOR LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE PROPERTY."
          }
        </p>
      </div>
    </article>
  );
};

Terms.defaultProps = defaultProps;

export default Terms;
