import { createContext } from "react";

export const TimeContext = createContext<{ timeList: string[]; time: string }>({ timeList: [], time: "" });
export const GeoContext = createContext<{
  coordinate: [number, number] | undefined;
  value: number | undefined;
  location: string;
}>({
  coordinate: undefined,
  value: undefined,
  location: "",
});

export const ConfigContext = createContext<{
  setLayer: (layer: { station: boolean; model: boolean }) => void;
  layer: {
    station: boolean;
    model: boolean;
  };
}>({
  setLayer: () => {},
  layer: {
    station: true,
    model: true,
  },
});
