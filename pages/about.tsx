import React, { useState, useEffect } from "react";

type IAboutProps = {};

const defaultProps = {};

const About: React.FC<IAboutProps> = (props) => {
  const {} = props;

  useEffect(() => {}, []);

  return <React.Fragment>About</React.Fragment>;
};

About.defaultProps = defaultProps;

export default About;
