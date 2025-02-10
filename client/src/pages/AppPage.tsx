import { getTimeList } from "@/api";
import { GradientBar, LayerToggle, Notifications, OpenLayerMap, SideBar, TimeSlider, UserMenu } from "@/components";
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
    type: 0 | 1;
    coordinate: [number, number] | undefined;
    value: number | undefined;
    location: string;
    time: string;
  }>({
    type: 0,
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
            value={{
              type: markData.type,
              coordinate: markData.coordinate,
              value: markData.value,
              location: markData.location,
            }}
          >
            <OpenLayerMap setMarkData={setMarkData} />
            <div id="overlay-layer" className="z-[1000]">
              <div className="absolute right-3 mt-[1.5rem] flex flex-row items-center gap-5">
                <Notifications className="" />
                <UserMenu className="" />
              </div>
              <SideBar setExpanded={setExpanded} />
              <LayerToggle className="ml-[29rem] pt-[1.5rem]" />
              <TimeSlider expanded={expanded} className="" setTime={setTime} />
              <GradientBar className="absolute bottom-0 right-5" />
            </div>
          </GeoContext.Provider>
        </TimeContext.Provider>
      </ConfigContext.Provider>
    </div>
  );
};

export default AppPage;
