import { Spin } from "antd";
import React from "react";

const Loading: React.FC<{ children?: React.ReactNode; loading: boolean }> = ({ loading, children }) => {
  return (
    <>
      {loading ? (
        <Spin size="large" tip="Loading" className="flex h-full w-full items-center justify-center" />
      ) : (
        <div className="">{children}</div>
      )}
    </>
  );
};

export default Loading;
