import { getStatisticByDistrict } from "@/api";
import InfoCards from "@/components/SideBar/Location/WarningTab/InfoCards";
import { IPropsModelTab } from "@/components/SideBar/Location/WarningTab/types";
import { convertCoordinate } from "@/config/utils";
import { GeoContext, TimeContext } from "@/context";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

const StationsTab: React.FC<IPropsModelTab> = (props) => {
  const { time } = useContext(TimeContext);
  const geoContext = useContext(GeoContext);
  const [coordinate, setCoordinate] = useState<[string, string]>(["", ""]);
  const mutation = useMutation({
    mutationKey: ["district", props.district_id],
    mutationFn: ({ district_id, date }: { district_id: string; date: string }) =>
      getStatisticByDistrict(district_id, date),
  });

  useEffect(() => {
    mutation.mutate({ district_id: props.district_id, date: time });
  }, [props.district_id, time]);

  useEffect(() => {
    if (mutation.data) {
      //   console.log(mutation.data);
    }
  }, [mutation.data]);

  useEffect(() => {
    const projectedCoordinate = convertCoordinate("EPSG:3857", "EPSG:4326", geoContext.coordinate);
    if (!projectedCoordinate) return;
    setCoordinate([projectedCoordinate[0], projectedCoordinate[1]]);
  }, [geoContext.coordinate]);

  return (
    <div className="flex w-full flex-col gap-3">
      <InfoCards.DataSourceCard
        content={
          <div className="flex flex-col gap-1 text-xs font-medium">
            <p className="text-sm font-semibold">Vị trí: {geoContext.location}</p>
            <p>
              Vĩ độ: {coordinate[0]}; Kinh độ: {coordinate[1]}
            </p>
          </div>
        }
        source="Trạm"
      />
      <InfoCards.AirQualityCard
        aqi_index={geoContext.value || null}
        pm_25={geoContext.value || null}
        status="Có hại cho sức khoẻ"
        time={time}
      />
      <InfoCards.HealthRecommendationCard
        recommendation={"Nhóm người nhạy cảm có thể chịu ảnh hưởng sức khỏe. Số đông không có nguy cơ bị tác động"}
      />
    </div>
  );
};
export default StationsTab;
