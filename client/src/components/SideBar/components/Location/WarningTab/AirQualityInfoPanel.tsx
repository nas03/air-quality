import { WarningTabInfoCards } from "@/components/SideBar/components/Location/WarningTab/WarningTabInfoCards";
import { getSvgAndColorByAQI } from "@/components/SideBar/utils";
import { TimeContext } from "@/context";
import { useContext } from "react";

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
