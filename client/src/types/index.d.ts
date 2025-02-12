import { GeoContextType } from "@/types/contexts";

export type MarkData = GeoContextType & { time: string };
export interface AirQualityData {
  aqi_index: number;
  pm_25: number;
  status: string;
  time: string;
  name: string;
  location: string | string[];
  recommendation: string;
}
