import { cn } from "@/lib/utils";
import React from "react";
import { GoQuestion } from "react-icons/go";

export interface CardData {
  header: string;
  data: {
    content: string | number;
    unit?: string;
  }[];
}
interface IPropsAnalyticsBoard extends React.ComponentPropsWithoutRef<"div">, CardData {}

const DataDescriptionCard: React.FC<IPropsAnalyticsBoard> = ({ className, ...props }) => {
  return (
    <div className={cn("flex h-full min-w-[15rem] flex-col gap-5 rounded-md bg-white p-5 text-[#606781]", className)}>
      <div className="flex flex-row justify-between">
        <p className="text-lg uppercase">{props.header}</p>
        <GoQuestion />
      </div>
      <div className="flex flex-row justify-between">
        {props.data.map((el, index) => (
          <p key={index}>
            <span className="font-bold">{el.content}</span> {el.unit && el.unit}
          </p>
        ))}
      </div>
    </div>
  );
};

export default DataDescriptionCard;
