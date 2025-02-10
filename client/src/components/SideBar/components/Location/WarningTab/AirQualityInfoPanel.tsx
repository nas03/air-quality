import WarningTabInfoCards from "@/components/SideBar/components/Location/WarningTab/WarningTabInfoCards";
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
}

const AirQualityInfoPanel: React.FC<IPropsAirQualityInfoPanel> = (props) => {
  const { time } = useContext(TimeContext);
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
        status="Có hại cho sức khoẻ"
        time={time}
      />
      <WarningTabInfoCards.HealthRecommendationCard recommendation={props.recommendation} />
    </div>
  );
};
export default AirQualityInfoPanel;
