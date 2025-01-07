import { TimeContext } from "@/context";
import { PlayCircleFilled } from "@ant-design/icons";
import { Slider, SliderSingleProps } from "antd";
import React, { useContext, useEffect, useState } from "react";

interface IPropsTimeSlider {
  setTime: (value: string | ((prevState: string) => string)) => void;
}
interface IPropsTimeSlider {
  setTime: (value: string | ((prevState: string) => string)) => void;
  className?: string;
}

const TimeSlider: React.FC<IPropsTimeSlider> = ({ setTime, className }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [marks, setMarks] = useState<SliderSingleProps["marks"] | undefined>(undefined);
  const { timeList } = useContext(TimeContext);

  useEffect(() => {
    const tempMark: SliderSingleProps["marks"] = Object.fromEntries(
      timeList.slice(0, 6).map((time, index) => {
        const formattedTime = time.replace(/-/g, "/");
        return [
          index,
          {
            style: index === 5 ? { color: "#f50" } : { fontWeight: "bold" },
            label: index === 5 ? <strong>{formattedTime}</strong> : formattedTime,
          },
        ];
      }),
    );
    setMarks(tempMark);
  }, [timeList]);

  const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (value) =>
    `${timeList[Number(value)]}`;

  const handleClick = () => {
    if (sliderValue < 5) {
      setSliderValue((prev) => prev + 1);
      setTime(timeList[sliderValue + 1]);
    }

    const intervalId = setInterval(() => {
      setSliderValue((prev) => {
        if (prev < 6) {
          setTime(timeList[prev + 1]);
          return prev + 1;
        } else {
          clearInterval(intervalId);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(intervalId);
  };

  return (
    <div
      className={`${className} flex h-fit w-[55vw] flex-row items-start gap-10 rounded-xl bg-white bg-opacity-70 p-5 px-10`}
    >
      <button className="shrink-0 rounded-full text-4xl" onClick={handleClick}>
        <PlayCircleFilled translate="yes" />
      </button>
      {timeList.at(0) && (
        <Slider
          marks={marks}
          step={1}
          value={sliderValue}
          max={5}
          tooltip={{ formatter, autoAdjustOverflow: true }}
          onChange={(e) => {
            setSliderValue(e);
            setTime(timeList[e]);
          }}
          className="flex-1"
          id="time-slider"
        />
      )}
    </div>
  );
};

export default TimeSlider;
