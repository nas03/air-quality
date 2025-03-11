import { TimeContext } from "@/context";
import { useContext } from "react";
import { getSvgAndColorByAQI } from "../../../config";
import { WarningTabInfoCards } from "./WarningTabInfoCards";

export interface IPropsAirQualityInfoPanel {
  district_id: string;
  type: "station" | "model";
  name: string;
  location: string | string[];
  aqi_index: string;
  pm_25: string;
  recommendation: string;
  status: string;
}

const AirQualityInfoPanel: React.FC<IPropsAirQualityInfoPanel> = (props) => {
  const { time } = useContext(TimeContext);
  const format = getSvgAndColorByAQI(Number(props.aqi_index));

  return (
    <div className="flex w-full flex-col gap-3">
      <WarningTabInfoCards.WeatherInfoCard
        temperature={{
          max: 18,
          min: 14,
          avg: 16,
        }}
        weather="Cloudy"
        wind_speed={1}
      />
      <WarningTabInfoCards.DataSourceCard
        name={props.name}
        location={props.location}
        source={props.type === "model" ? "Mô hình" : "Trạm"}
      />
      <WarningTabInfoCards.AirQualityCard
        aqi_index={props.aqi_index}
        pm_25={props.pm_25}
        status={props.status}
        time={time}
        color={format.color}
        icon={format.icon}
      />
      <WarningTabInfoCards.HealthRecommendationCard recommendation={props.recommendation} />
    </div>
  );
};
export default AirQualityInfoPanel;
