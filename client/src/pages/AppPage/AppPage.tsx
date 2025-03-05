import { getTimeList } from "@/api";
import { ConfigContext, GeoContext, TimeContext } from "@/context";
import { cn } from "@/lib/utils";
import { MarkData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
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
    <div className="h-full w-full" style={{ height: "100vh" }}>
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
            <motion.div
              className={cn(
                "transition-[width, height] absolute h-full duration-500",
                openDrawer ? "max-2xl:w-[75vw] 2xl:w-[82vw]" : "w-full",
              )}>
              <OpenLayerMap className={cn("h-full w-full")} setMarkData={setMarkData} />
              <div className="pointer-events-none fixed inset-0 z-[1000]">
                <SideBar
                  className="transition-[width, height] pointer-events-auto fixed left-3 top-4 h-[calc(100vh-1rem)] max-2xl:w-[21rem] 2xl:w-96"
                  setExpanded={setExpanded}
                />
                <LayerToggle
                  className={cn(
                    "pointer-events-auto fixed right-3 top-[13rem] h-fit transition-transform duration-500",
                    openDrawer && "-translate-x-[calc(25vw-6px)] 2xl:-translate-x-[calc(18vw-6px)]",
                  )}
                />

                <AppMenu
                  openDrawer={openDrawer}
                  setOpenDrawer={setOpenDrawer}
                  className={cn(
                    "pointer-events-auto fixed right-3 top-0 mt-[1.5rem] flex flex-row items-center gap-5 transition-transform duration-500",
                    openDrawer && "-translate-x-[calc(25vw-6px)] 2xl:-translate-x-[calc(18vw-6px)]",
                  )}
                />

                <div
                  className={cn(
                    "pointer-events-auto fixed bottom-0 left-0 flex w-full flex-row items-end gap-5 pr-3 transition-all duration-500",
                    /* openDrawer && "-translate-x-[calc(25vw-6px)] 2xl:-translate-x-[calc(18vw-6px)]", */
                    openDrawer ? "max-2xl:w-[75vw] 2xl:w-[82vw]" : "w-full",
                  )}>
                  <TimeSlider
                    openDrawer={openDrawer}
                    className={cn(
                      "w-full transition-all duration-500",
                      expanded ? "max-2xl:ml-[23rem] 2xl:ml-[26rem]" : "",
                    )}
                    setTime={setTime}
                  />
                  <GradientBar className={cn("relative transition-all duration-500")} />
                </div>
              </div>
            </motion.div>
            <MenuDrawer className={cn()} open={openDrawer} />
          </GeoContext.Provider>
        </TimeContext.Provider>
      </ConfigContext.Provider>
    </div>
  );
};

export default AppPage;
