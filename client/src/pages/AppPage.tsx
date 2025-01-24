import { getTimeList } from "@/api";
import { LayerToggle, OpenLayerMap, SideBar, TimeSlider, UserMenu } from "@/components";
import { ConfigContext, GeoContext, TimeContext } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const AppPage = () => {
  const { data: timeList, isSuccess } = useQuery({
    queryKey: ["time"],
    queryFn: getTimeList,
  });
  const [time, setTime] = useState("");
  const [markData, setMarkData] = useState<{
    coordinate: [number, number] | undefined;
    value: number | undefined;
    location: string;
    time: string;
  }>({
    coordinate: undefined,
    value: undefined,
    location: "",
    time: time,
  });
  const [layer, setLayer] = useState({
    station: true,
    model: true,
  });
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (isSuccess) setTime(timeList[0]);
  }, [isSuccess]);

  return (
    <div className="h-screen w-screen">
      <ConfigContext.Provider value={{ setLayer, layer: layer }}>
        <TimeContext.Provider value={{ timeList: timeList || [], time }}>
          <GeoContext.Provider
            value={{ coordinate: markData.coordinate, value: markData.value, location: markData.location }}
          >
            <OpenLayerMap setMarkData={setMarkData} />
            <div id="overlay-layer" className="z-[1000]">
              <UserMenu className="absolute right-3 top-[1.5rem]" />
              <SideBar setExpanded={setExpanded} />
              <LayerToggle className="ml-[29rem] pt-[1.5rem]" />
              <TimeSlider expanded={expanded} className="" setTime={setTime} />
            </div>
          </GeoContext.Provider>
        </TimeContext.Provider>
      </ConfigContext.Provider>
    </div>
  );
};

export default AppPage;
