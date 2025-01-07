import { getTimeList } from "@/api";
import { OpenLayerMap, SideBar, TimeSlider } from "@/components";
import { TimeContext } from "@/context";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function App() {
  const { data: timeList, isSuccess } = useQuery({ queryKey: ["time"], queryFn: getTimeList });
  const [time, setTime] = useState("");

  useEffect(() => {
    isSuccess && setTime(timeList[0]);
  }, [isSuccess]);

  return (
    <div className="h-screen w-screen">
      {isSuccess && (
        <TimeContext.Provider value={{ timeList, time }}>
          <OpenLayerMap />
          <div id="overlay-layer" className="z-[1000]">
            <SideBar />
            <TimeSlider className="absolute bottom-0 left-1/2 -translate-x-1/2" setTime={setTime} />
          </div>
        </TimeContext.Provider>
      )}
    </div>
  );
}

export default App;
