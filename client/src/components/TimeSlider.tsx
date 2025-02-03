import { IPropsTimeSlider } from "@/components/types";
import { TimeContext } from "@/context";
import { cn } from "@/lib/utils";
import { Slider, SliderSingleProps } from "antd";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { GoPlay } from "react-icons/go";

const TimeSlider: React.FC<IPropsTimeSlider> = ({ setTime, className, expanded }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [marks, setMarks] = useState<SliderSingleProps["marks"]>();
  const { timeList } = useContext(TimeContext);

  const formatTimeLabel = useCallback((time: string, isLast: boolean) => {
    const formattedTime = time.split("-").reverse().join("-");
    return {
      style: isLast ? { color: "red", fontSize: 12 } : { fontWeight: 500, fontSize: 12 },
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

  return (
    <div
      className={cn(
        className,
        expanded ? "ml-[28rem] w-[calc(100vw-30rem)]" : "w-screen",
        "bg-3 font-roboto absolute bottom-0 flex h-fit flex-row items-center gap-16 rounded-md bg-white/50 pb-2 pl-10 pr-16 pt-5 backdrop-blur-md transition-all duration-150",
      )}
    >
      <button className="shrink-0 rounded-full text-4xl" onClick={handleClick}>
        <GoPlay />
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
