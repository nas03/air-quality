import { Spin } from "antd";
import React from "react";

interface LoadingProps {
  children?: React.ReactNode;
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading, children }) => {
  if (loading) {
    return <Spin size="large" tip="Loading" className="flex h-full w-full items-center justify-center" />;
  }

  return <div>{children}</div>;
};

export default Loading;
