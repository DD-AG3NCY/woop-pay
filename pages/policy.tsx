import React, { useState, useEffect } from "react";

type IPolicyProps = {};

const defaultProps = {};

const Policy: React.FC<IPolicyProps> = (props) => {
  const {} = props;

  useEffect(() => {}, []);

  return <React.Fragment>Policy</React.Fragment>;
};

Policy.defaultProps = defaultProps;

export default Policy;
