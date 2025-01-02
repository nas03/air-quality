import { PlayCircleFilled } from "@ant-design/icons";
import { SliderSingleProps, Slider } from "antd";
import React, { useState } from "react";

interface IPropsTimeSlider {
  setTime: (value: string | ((prevState: string) => string)) => void;
}
const TimeSlider: React.FC<IPropsTimeSlider> = ({ setTime }) => {
  const presetTime = ["2009-10-01", "2009-11-01", "2009-12-01"];
  const marks: SliderSingleProps["marks"] = {
    0: { style: { fontWeight: "bold" }, label: "01/10/2009" },
    1: { style: { fontWeight: "bold" }, label: "01/11/2009" },
    2: { style: { color: "#f50" }, label: <strong>01/12/2009</strong> },
  };
  const [sliderValue, setSliderValue] = useState(0);
  const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
    value,
  ) => `${presetTime[Number(value)]}`;
  const handleClick = () => {
    // First update immediately
    if (sliderValue < 2) {
      setSliderValue((prev) => prev + 1);
      setTime(presetTime[sliderValue + 1]);
    }

    // Then set up interval for subsequent updates
    const intervalId = setInterval(() => {
      setSliderValue((prev) => {
        if (prev < 2) {
          setTime(presetTime[prev + 1]);
          return prev + 1;
        } else {
          clearInterval(intervalId);
          return prev;
        }
      });
    }, 2000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  };

  return (
    <>
      <button className="shrink-0 rounded-full text-4xl" onClick={handleClick}>
        <PlayCircleFilled translate="yes" />
      </button>
      <Slider
        marks={marks}
        step={1}
        value={sliderValue}
        max={2}
        tooltip={{ formatter, autoAdjustOverflow: true }}
        onChange={(e) => {
          setSliderValue(e);
          setTime(presetTime[e]);
        }}
        className="flex-1"
        id="time-slider"
      />
    </>
  );
};

export default TimeSlider;
