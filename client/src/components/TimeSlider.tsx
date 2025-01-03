import { PlayCircleFilled } from "@ant-design/icons";
import { SliderSingleProps, Slider } from "antd";
import React, { useState } from "react";

interface IPropsTimeSlider {
  setTime: (value: string | ((prevState: string) => string)) => void;
}
interface IPropsTimeSlider {
  setTime: (value: string | ((prevState: string) => string)) => void;
  className?: string;
}

const TimeSlider: React.FC<IPropsTimeSlider> = ({ setTime, className }) => {
  const presetTime = [
    "2024-11-01",
    "2024-11-02",
    "2024-11-03",
    "2024-11-04",
    "2024-11-05",
    "2024-11-06",
    "2024-11-07",
    "2024-11-08",
    "2024-11-09",
    "2024-11-10",
    "2024-11-11",
    "2024-11-12",
    "2024-11-13",
    "2024-11-14",
    "2024-11-15",
    "2024-11-16",
    "2024-11-17",
    "2024-11-18",
    "2024-11-19",
    "2024-11-20",
    "2024-11-21",
    "2024-11-22",
    "2024-11-23",
    "2024-11-24",
    "2024-11-25",
    "2024-11-26",
    "2024-11-27",
    "2024-11-28",
    "2024-11-29",
    "2024-11-30",
  ];
  const marks: SliderSingleProps["marks"] = {
    0: { style: { fontWeight: "bold" }, label: "2024/11/01" },
    1: { style: { fontWeight: "bold" }, label: "2024/11/02" },
    2: { style: { fontWeight: "bold" }, label: "2024/11/03" },
    3: { style: { fontWeight: "bold" }, label: "2024/11/04" },
    4: { style: { fontWeight: "bold" }, label: "2024/11/05" },
    5: { style: { color: "#f50" }, label: <strong>2024/11/06</strong> },
  };
  const [sliderValue, setSliderValue] = useState(0);
  const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
    value,
  ) => `${presetTime[Number(value)]}`;
  const handleClick = () => {
    // First update immediately
    if (sliderValue < 5) {
      setSliderValue((prev) => prev + 1);
      setTime(presetTime[sliderValue + 1]);
    }

    // Then set up interval for subsequent updates
    const intervalId = setInterval(() => {
      setSliderValue((prev) => {
        if (prev < 6) {
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
    <div
      className={`${className} flex h-fit w-[55vw] flex-row items-start gap-10 rounded-xl bg-white bg-opacity-70 p-5 px-10`}
    >
      <button className="shrink-0 rounded-full text-4xl" onClick={handleClick}>
        <PlayCircleFilled translate="yes" />
      </button>
      <Slider
        marks={marks}
        step={1}
        value={sliderValue}
        max={5}
        tooltip={{ formatter, autoAdjustOverflow: true }}
        onChange={(e) => {
          setSliderValue(e);
          setTime(presetTime[e]);
        }}
        className="flex-1"
        id="time-slider"
      />
    </div>
  );
};

export default TimeSlider;
