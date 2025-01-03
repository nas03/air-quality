import { InfoBar, OpenLayerMap, SearchBar, TimeSlider } from "@/components";
import { EnvironmentOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

import { useState } from "react";

function App() {
  const [time, setTime] = useState("2009-10-01");

  return (
    <div className="h-screen w-screen">
      <OpenLayerMap time={time} />
      <div id="overlay-layer" className="z-[1000]">
        <div className="absolute left-0 top-0 ml-[3rem] mt-[3rem] flex w-[20rem] flex-col gap-5">
          <SearchBar className="relative" />
          <Collapse
            expandIconPosition="end"
            defaultActiveKey={["1"]}
            className="relative w-full rounded-md"
          >
            <Collapse.Panel
              key={1}
              header={
                <EnvironmentOutlined className="text-base text-blue-500" />
              }
              className="rounded-md bg-white"
            >
              <InfoBar />
            </Collapse.Panel>
          </Collapse>
        </div>
        <TimeSlider
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          setTime={setTime}
        />
      </div>
    </div>
  );
}

export default App;
