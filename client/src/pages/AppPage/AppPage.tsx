import { getTimeList } from "@/api";
import { ConfigContext, GeoContext, TimeContext } from "@/context";
import { cn } from "@/lib/utils";
import { MarkData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppMenu, GradientBar, LayerToggle, MenuDrawer, SideBar, TimeSlider } from "./components";
import OpenLayerMap from "./components/OpenLayerMap/OpenLayerMap";

const AppPage = () => {
  const { data: timeList, isSuccess } = useQuery({
    queryKey: ["time"],
    queryFn: getTimeList,
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [time, setTime] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [markData, setMarkData] = useState<MarkData>({
    type: 0,
    coordinate: undefined,
    aqi_index: null,
    pm_25: null,
    location: "",
    time: time,
  });
  const [layer, setLayer] = useState({
    station: true,
    model: true,
    wind: true,
  });

  useEffect(() => {
    if (isSuccess) setTime(timeList[0]);
  }, [isSuccess]);

  return (
    <div className="h-screen w-full">
      <ConfigContext.Provider value={{ setLayer, layer }}>
        <TimeContext.Provider value={{ timeList: timeList || [], time }}>
          <GeoContext.Provider
            value={{
              type: markData.type,
              coordinate: markData.coordinate,
              aqi_index: markData.aqi_index,
              pm_25: markData.pm_25,
              location: markData.location,
            }}>
            <div className={cn("absolute h-screen transition-all duration-500", openDrawer ? "w-[82vw]" : "w-full")}>
              <OpenLayerMap className="h-full w-full" setMarkData={setMarkData} />
              <div className="z-[1000]">
                <SideBar className="absolute left-12 top-4 max-h-screen w-96" setExpanded={setExpanded} />
                <LayerToggle className="absolute right-3 top-[13rem] h-fit" />

                <AppMenu
                  openDrawer={openDrawer}
                  setOpenDrawer={setOpenDrawer}
                  className="absolute right-3 top-0 mt-[1.5rem] flex flex-row items-center gap-5"
                />

                <div className="absolute bottom-0 left-0 flex w-full flex-row items-end gap-10 pr-3">
                  <TimeSlider expanded={expanded} className="" setTime={setTime} />
                  <GradientBar
                    className={cn("relative transition-all duration-500", openDrawer && "-translate-x-3 transform")}
                  />
                </div>
              </div>
            </div>
            <MenuDrawer className={cn()} open={openDrawer} />
          </GeoContext.Provider>
        </TimeContext.Provider>
      </ConfigContext.Provider>
    </div>
  );
};

export default AppPage;
