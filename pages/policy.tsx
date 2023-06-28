import React, { useState, useEffect } from "react";

type IPolicyProps = {};

const defaultProps = {};

const Policy: React.FC<IPolicyProps> = (props) => {
  const {} = props;

  useEffect(() => {}, []);

  return (
    <article className="flex justify-center">
      <div className="max-w-lg my-20 p-5 rounded-lg shadow-md">
        <h2 className="text-center font-semibold text-2xl mb-5">
          {"Woop Pay Privacy Policy"}
        </h2>
        <p className="text-center mb-5">{"Last modified: June 27, 2023"}</p>
        <p className="text-center mb-5">{"Data We Collect"}</p>
        <p className="text-justify mb-5">
          {
            "Privacy is central to everything we do. Accordingly, we aspire to be transparent about the data we collect. We do not maintain user accounts and do not collect and store personal data, such as your name or internet protocol (“IP”) address. When you interact with the Services, we collect only publicly-available blockchain data. We also collect certain activity data using Mixpanel. These analytics tools help us understand how our users interact with our services. For instance, we track events such as visits to the payment page, including details such as the token used, network name, amount, user's public blockchain address, and related link. When you connect your non-custodial blockchain wallet to the Services, we collect your publicly-available blockchain address. Note that blockchain addresses are publicly-available data that are not created or assigned by us or any central party, and by themselves are not personally identifying."
          }
        </p>
        <p className="text-center mb-5">{"How We Share Data"}</p>
        <p className="text-justify mb-5">
          {
            "We may share or disclose the data we collect with service providers. We may share your information with our service providers to assist us in providing the Services. For example, we may share your wallet address and event data with service providers like Infura and Mixpanel to provide technical infrastructure services and to help us understand the usage patterns for our services."
          }
        </p>
        <p className="text-center mb-5">{"Age Requirements"}</p>
        <p className="text-justify mb-5">
          {
            "The Services are intended for a general audience and are not directed at children."
          }
        </p>
      </div>
    </article>
  );
};

Policy.defaultProps = defaultProps;

export default Policy;
