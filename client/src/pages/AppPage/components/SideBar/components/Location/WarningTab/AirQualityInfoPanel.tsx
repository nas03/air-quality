import { getSvgAndColorByAQI } from "../../../config";
import { WarningTabInfoCards } from "./WarningTabInfoCards";
import { IPropsAirQualityInfoPanel } from "./types";

const DEFAULT_TEMPERATURE = {
  max: 0,
  min: 0,
  avg: 0,
};
const AirQualityInfoPanel: React.FC<IPropsAirQualityInfoPanel> = (props) => {
  const format = getSvgAndColorByAQI(Number(props.aqi_index));

  return (
    <div className="flex w-full flex-col gap-3">
      <WarningTabInfoCards.DataSourceCard
        data={{
          name: props.name,
          location: props.location,
          source: props.type === "model" ? "Mô hình" : "Trạm",
        }}
      />
      <WarningTabInfoCards.WeatherInfoCard
        data={{
          temperature: props.weatherData?.temperature || DEFAULT_TEMPERATURE,
          weather: props.weatherData?.weather || "",
          wind_speed: props.weatherData?.wind_speed || 0,
        }}
      />
      <WarningTabInfoCards.AirQualityCard
        data={{
          aqi_index: props.aqi_index,
          pm_25: props.pm_25,
          status: props.status,
          time: props.time,
          color: format.color,
          icon: format.icon,
        }}
      />
      <WarningTabInfoCards.HealthRecommendationCard data={props.recommendation} />
    </div>
  );
};
export default AirQualityInfoPanel;
