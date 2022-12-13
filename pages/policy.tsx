import React, { useState, useEffect } from "react";

type IPolicyProps = {};

const defaultProps = {};

const Policy: React.FC<IPolicyProps> = (props) => {
  const {} = props;

  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <p>Woop Pay Privacy Policy</p>
      <p>Last modified: December 13, 2022</p>
      <br />
      <p>Data We Collect</p>
      <p>
        Privacy is central to everything we do. Accordingly, we aspire to be
        transparent about what little data we do collect. We do not maintain
        user accounts and do not collect and store personal data, such as your
        name or internet protocol (“IP”) address. When you interact with the
        Services, we collect only publicly-available blockchain data. When you
        connect your non-custodial blockchain wallet to the Services, we collect
        your publicly-available blockchain address. Note that blockchain
        addresses are publicly-available data that are not created or assigned
        by us or any central party, and by themselves are not personally
        identifying.
      </p>
      <br />
      <p>How We Share Data</p>
      <p>
        We may share or disclose the data we collect with service providers. We
        may share your information with our service providers to assist us in
        providing the Services. For example, we may share your wallet address
        with service providers like Infura to provide technical infrastructure
        services.
      </p>
      <br />
      <p>Age Requirements </p>
      <p>
        The Services are intended for a general audience and are not directed at
        children.
      </p>
    </React.Fragment>
  );
};

Policy.defaultProps = defaultProps;

export default Policy;
