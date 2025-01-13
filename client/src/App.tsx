import { getTimeList } from "@/api";
import { LayerToggle, OpenLayerMap, SideBar, TimeSlider } from "@/components";
import Authentication from "@/components/Authentication/Authentication";
import { ConfigContext, GeoContext, TimeContext } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function App() {
  const { data: timeList, isSuccess } = useQuery({ queryKey: ["time"], queryFn: getTimeList });
  const [markData, setMarkData] = useState<{
    coordinate: [number, number] | undefined;
    value: number | undefined;
    location: string;
  }>({
    coordinate: undefined,
    value: undefined,
    location: "",
  });
  const [time, setTime] = useState("");
  const [layer, setLayer] = useState({
    station: true,
    model: true,
  });

  useEffect(() => {
    isSuccess && setTime(timeList[0]);
  }, [isSuccess]);

  return (
    <div className="h-screen w-screen">
      {isSuccess && (
        <ConfigContext.Provider value={{ setLayer, layer: layer }}>
          <TimeContext.Provider value={{ timeList, time }}>
            <GeoContext.Provider
              value={{ coordinate: markData.coordinate, value: markData.value, location: markData.location }}
            >
              <OpenLayerMap setMarkData={setMarkData} />
              <div id="overlay-layer" className="z-[1000]">
                <Authentication className="absolute right-0 top-0 mr-[3rem] mt-[3rem]" />
                <SideBar />
                <LayerToggle className="ml-[29rem] pt-[3.5rem]" />
                <TimeSlider className="" setTime={setTime} />
              </div>
            </GeoContext.Provider>
          </TimeContext.Provider>
        </ConfigContext.Provider>
      )}
    </div>
  );
}

export default App;
