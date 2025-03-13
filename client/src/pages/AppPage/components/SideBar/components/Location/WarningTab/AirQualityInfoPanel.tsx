import { UserAlert } from "@/api/alertSetting";
import { TimeContext } from "@/context";
import { useContext } from "react";
import { getSvgAndColorByAQI } from "../../../config";
import { WarningTabInfoCards } from "./WarningTabInfoCards";

export type DataSourceCardType = {
  name: string;
  location: string | string[];
  type: "station" | "model";
};

export type WeatherInfoCardType = {
  weatherData: Omit<UserAlert, "id" | "aqi_index"> | null;
};

export type AirQualityCardType = {
  aqi_index: string;
  pm_25: string;
  status: string;
  recommendation: string;
};

export interface IPropsAirQualityInfoPanel extends DataSourceCardType, WeatherInfoCardType, AirQualityCardType {
  district_id: string;
}

const AirQualityInfoPanel: React.FC<IPropsAirQualityInfoPanel> = (props) => {
  const { time } = useContext(TimeContext);
  const format = getSvgAndColorByAQI(Number(props.aqi_index));

  return (
    <div className="flex w-full flex-col gap-3">
      <WarningTabInfoCards.DataSourceCard
        name={props.name}
        location={props.location}
        source={props.type === "model" ? "Mô hình" : "Trạm"}
      />
      <WarningTabInfoCards.WeatherInfoCard
        temperature={
          props.weatherData?.temperature || {
            max: 0,
            min: 0,
            avg: 0,
          }
        }
        weather={props.weatherData?.weather || ""}
        wind_speed={props.weatherData?.wind_speed || 0}
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
