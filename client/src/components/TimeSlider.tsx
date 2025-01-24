import { IPropsTimeSlider } from "@/components/types";
import { TimeContext } from "@/context";
import { PlayCircleFilled } from "@ant-design/icons";
import { Slider, SliderSingleProps } from "antd";
import React, { useCallback, useContext, useEffect, useState } from "react";

const TimeSlider: React.FC<IPropsTimeSlider> = ({ setTime, className, expanded }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [marks, setMarks] = useState<SliderSingleProps["marks"]>();
  const { timeList } = useContext(TimeContext);

  const formatTimeLabel = useCallback((time: string, isLast: boolean) => {
    const formattedTime = time.split("-").reverse().join("/");
    return {
      style: isLast ? { color: "#f50" } : { fontWeight: "bold" },
      label: isLast ? <strong>{formattedTime}</strong> : formattedTime,
    };
  }, []);

  useEffect(() => {
    const tempMark = Object.fromEntries(
      timeList.slice(0, 6).map((time, index) => [index, formatTimeLabel(time, index === 5)]),
    );
    setMarks(tempMark);
  }, [timeList, formatTimeLabel]);

  const updateSliderValue = useCallback(
    (newValue: number) => {
      setSliderValue(newValue);
      setTime(timeList[newValue]);
    },
    [setTime, timeList],
  );

  const handleClick = useCallback(() => {
    if (sliderValue >= 5) return;

    updateSliderValue(sliderValue + 1);

    const intervalId = setInterval(() => {
      setSliderValue((prev) => {
        if (prev < 6) {
          setTime(timeList[prev + 1]);
          return prev + 1;
        }
        clearInterval(intervalId);
        return prev;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [sliderValue, updateSliderValue, setTime, timeList]);

  const containerClasses = `${className} absolute bottom-0 flex h-fit transition-all duration-150 
    ${expanded ? "ml-[26rem] w-[calc(100vw-30rem)]" : "w-screen"} 
    flex-row items-start gap-10 rounded-xl bg-white bg-opacity-70 px-10 pt-3`;

  return (
    <div className={containerClasses}>
      <button className="shrink-0 rounded-full text-4xl" onClick={handleClick}>
        <PlayCircleFilled translate="yes" />
      </button>
      {timeList.at(0) && (
        <Slider
          marks={marks}
          step={1}
          value={sliderValue}
          max={5}
          tooltip={{
            formatter: (value?: number) => (value !== undefined ? timeList[value] : ""),
            autoAdjustOverflow: true,
          }}
          onChange={updateSliderValue}
          className="flex-1"
          id="time-slider"
        />
      )}
    </div>
  );
};

export default TimeSlider;
