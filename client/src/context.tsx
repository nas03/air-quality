import { createContext } from "react";

export const TimeContext = createContext<{ timeList: string[]; time: string }>({ timeList: [], time: "" });
