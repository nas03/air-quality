import { useState } from "react";
import TimeSlider from "@/components/TimeSlider";
import OpenLayerMap from "@/components/OpenLayerMap";
function App() {
  const [time, setTime] = useState("2009-10-01");

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <OpenLayerMap time={time} />
      <div className="absolute bottom-0 left-1/2 z-[1000] flex h-fit w-[55vw] -translate-x-1/2 flex-row items-start gap-10 rounded-xl bg-white bg-opacity-70 p-5 px-10">
        <TimeSlider setTime={setTime} />
      </div>
    </div>
  );
}

export default App;
