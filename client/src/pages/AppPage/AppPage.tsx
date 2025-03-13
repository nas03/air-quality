import { getTimeList } from "@/api";
import { ConfigContext, GeoContext, TimeContext } from "@/context";
import { cn } from "@/lib/utils";
import { MarkData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Map } from "ol";
import { Coordinate } from "ol/coordinate";
import VectorLayer from "ol/layer/Vector";
import { useEffect, useRef, useState } from "react";
import { AppMenu, GradientBar, LayerToggle, MenuDrawer, SideBar, TimeSlider } from "./components";
import CurrentLocationData from "./components/CurrentLocationData";
import OpenLayerMap from "./components/OpenLayerMap/OpenLayerMap";
const AppPage = () => {
  const { data: timeList, isSuccess } = useQuery({
    queryKey: ["time"],
    queryFn: getTimeList,
  });
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<VectorLayer | null>(null);
  const [currentCoordinate, setCurrentCoordinate] = useState<Coordinate>([]);
  const updateMap = (map: Map) => {
    mapRef.current = map;
  };
  const updateMarker = (marker: VectorLayer) => {
    markerRef.current = marker;
  };
  const [openDrawer, setOpenDrawer] = useState(false);
  const [time, setTime] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [layer, setLayer] = useState({
    station: true,
    model: true,
    wind: true,
  });
  const [markData, setMarkData] = useState<MarkData>({
    type: 0,
    coordinate: undefined,
    aqi_index: null,
    pm_25: null,
    location: "",
    time: time,
    wind_speed: 0,
  });

  useEffect(() => {
    if (isSuccess) setTime(timeList[2]);
  }, [isSuccess]);

  // Framer Motion
  const transition = { type: "tween", duration: 0.3 };
  const animate = openDrawer ? "open" : "close";

  return (
    <div className="h-full w-full" style={{ height: "100vh" }}>
      <ConfigContext.Provider
        value={{
          setLayer,
          layer,
          mapRef,
          setMap: updateMap,
          markerRef,
          setMarker: updateMarker,
          currentCoordinate,
          setCurrentCoordinate,
        }}>
        <TimeContext.Provider value={{ timeList: timeList || [], time }}>
          <GeoContext.Provider
            value={{
              type: markData.type,
              coordinate: markData.coordinate,
              aqi_index: markData.aqi_index,
              pm_25: markData.pm_25,
              location: markData.location,
              wind_speed: markData.wind_speed,
            }}>
            <motion.div
              animate={animate}
              variants={{
                open: { width: "var(--main-width)" },
                close: { width: "100%" },
              }}
              transition={transition}
              className={cn(
                "absolute h-full [--main-width:82vw] max-2xl:[--main-width:75vw]",
                openDrawer ? "var(--main-width)" : "w-full",
              )}>
              <OpenLayerMap className="h-full w-full" setMarkData={setMarkData} />
              <div className="pointer-events-none fixed inset-0 z-[1000]">
                <SideBar
                  className="transition-[width, height] pointer-events-auto fixed left-3 top-4 h-[calc(100vh-1rem)] max-2xl:w-[21rem] 2xl:w-96"
                  setExpanded={setExpanded}
                />
                <motion.div
                  className={cn(
                    "pointer-events-auto fixed bottom-[20vh] right-3 h-fit cursor-pointer [--layer-toggle-translate:calc(6px-25vw)] 2xl:[--layer-toggle-translate:calc(6px-18vw)]",
                  )}
                  animate={animate}
                  variants={{
                    open: { translateX: "var(--layer-toggle-translate)" },
                    close: { translateX: "0" },
                  }}
                  transition={transition}>
                  <CurrentLocationData />
                </motion.div>
                <motion.div
                  className={cn(
                    "pointer-events-auto fixed right-3 top-[13rem] h-fit [--layer-toggle-translate:calc(6px-25vw)] 2xl:[--layer-toggle-translate:calc(6px-18vw)]",
                  )}
                  animate={animate}
                  variants={{
                    open: { translateX: "var(--layer-toggle-translate)" },
                    close: { translateX: "0" },
                  }}
                  transition={transition}>
                  <LayerToggle />
                </motion.div>
                <motion.div
                  className={cn(
                    "pointer-events-auto fixed right-3 top-0 mt-[1.5rem] [--app-menu-translate:calc(6px-25vw)] 2xl:[--app-menu-translate:calc(6px-18vw)]",
                  )}
                  animate={animate}
                  variants={{
                    open: { translateX: "var(--app-menu-translate)", right: "1rem" },
                    close: { translateX: "0", right: "0.75rem" },
                  }}
                  transition={transition}>
                  <AppMenu openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} className={cn("")} />
                </motion.div>

                <motion.div
                  className={cn("pointer-events-auto fixed bottom-3 left-0 flex w-full flex-row items-end gap-5 pr-3")}
                  animate={animate}
                  variants={{
                    open: { width: "var(--main-width)" },
                    close: { width: "100%" },
                  }}
                  transition={transition}>
                  <TimeSlider
                    openDrawer={openDrawer}
                    className={cn(
                      "w-full transition-all duration-300",
                      expanded ? "max-2xl:ml-[23rem] 2xl:ml-[26rem]" : "",
                    )}
                    setTime={setTime}
                  />
                  <GradientBar className={cn("relative")} />
                </motion.div>
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
