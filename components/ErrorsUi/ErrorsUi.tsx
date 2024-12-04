import React from "react";

type IErrorsUiProps = {
  errorMsg: string;
  errorNtk: string;
};

const defaultProps = {};

const ErrorsUi: React.FC<IErrorsUiProps> = (props) => {
  const { errorMsg, errorNtk } = props;

  return errorMsg ? (
    <div className="bg-white bg-opacity-30 border-white border rounded-xl">
      <div className="px-4 py-2 font-base text-sm">
        {'⚠️ '}
        {errorMsg}
      </div>
    </div>
  ) : errorNtk ? (
    <div className="bg-white bg-opacity-30 border-white border rounded-xl">
      <div className="px-4 py-2 font-base text-sm">
        {'⚠️ '}
        {errorNtk}
      </div>
    </div>
  ) : null;
};

ErrorsUi.defaultProps = defaultProps;

export default ErrorsUi;
