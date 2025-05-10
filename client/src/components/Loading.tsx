import { cn } from "@/lib/utils";
import { Spin } from "antd";
import React from "react";

interface LoadingProps extends React.ComponentPropsWithoutRef<"div"> {
    children?: React.ReactNode;
    loading: boolean;
    className?: string;
    fullscreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ loading, children, className, ...props }) => {
    if (loading) {
        return (
            <Spin
                {...props}
                size="large"
                tip="Loading"
                className={cn("flex h-full w-full items-center justify-center", className)}
            />
        );
    }

    return <div className={cn(className)}>{children}</div>;
};

export default Loading;
