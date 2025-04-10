import { cn } from "@/lib/utils";
import React from "react";

interface IPropsNavigator extends React.ComponentPropsWithoutRef<"div"> {}
const Navigator: React.FC<IPropsNavigator> = ({ className }) => {
    return (
        <div className={cn("", className)}>
            {/* <div className="">Nav</div>
      <img src="logo.svg" alt="logo" className="" />
      <div>
        <button>Sign In</button>
      </div> */}
        </div>
    );
};

export default Navigator;
