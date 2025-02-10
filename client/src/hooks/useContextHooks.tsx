import { TimeContext } from "@/context";
import { useContext } from "react";

export const useTimeList = () => useContext(TimeContext).timeList;
