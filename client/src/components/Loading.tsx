import { cn } from "@/lib/utils";
import { Spin } from "antd";
import React from "react";

interface LoadingProps {
    children?: React.ReactNode;
    loading: boolean;
    className?: string;
}

const Loading: React.FC<LoadingProps> = ({ loading, children, className }) => {
    if (loading) {
        return (
            <Spin
                size="large"
                tip="Loading"
                className={cn("flex h-full w-full items-center justify-center", className)}
            />
        );
    }

    return <div className={cn(className)}>{children}</div>;
};

export default Loading;
