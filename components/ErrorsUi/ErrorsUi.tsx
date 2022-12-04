import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import { useConnect } from "wagmi";

type IErrorsUiProps = {
  errorMsg: string;
};

const defaultProps = {};

const ErrorsUi: React.FC<IErrorsUiProps> = (props) => {
  //   const { errorMsg } = props;
  const { error } = useConnect();
  const errorMsg = "Error testing";

  useEffect(() => {}, []);

  return (error && error.message) || errorMsg ? (
    <div
      style={{ backgroundColor: "rgba(255,255,255, 0.3)" }}
      className="border-white border rounded-xl">
      <div className="px-4 py-2 font-base text-sm">
        {"⚠️ "}
        {error && error.message ? error.message : errorMsg ? errorMsg : ""}
      </div>
    </div>
  ) : null;
};

ErrorsUi.defaultProps = defaultProps;

export default ErrorsUi;
