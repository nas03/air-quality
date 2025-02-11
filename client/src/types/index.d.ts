export type MarkData = OmitGeoContextType & { time: string };
export interface AirQualityData {
  aqi_index: number;
  pm_25: number;
  status: string;
  time: string;
  name: string;
  location: string | string[];
  recommendation: string;
}
