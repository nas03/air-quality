import { IPropsTimeSlider } from "@/components/types";
import { useTimeList } from "@/hooks/useContextHooks";
import { cn } from "@/lib/utils";
import { Button, Slider, SliderSingleProps } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlinePauseCircle } from "react-icons/ai";
import { GoPlay } from "react-icons/go";

const SLIDER_MAX = 10;
const ANIMATION_INTERVAL = 5000;
const SLIDER_DATA_DEFAULT_IDX = 3;
const TimeSlider: React.FC<IPropsTimeSlider> = ({ setTime, className, openDrawer }) => {
    const timeList = useTimeList();
    const intervalRef = React.useRef<NodeJS.Timeout>();
    const [state, setState] = useState({
        sliderValue: SLIDER_DATA_DEFAULT_IDX,
        marks: {} as SliderSingleProps["marks"],
        isPlaying: false,
    });

    const formatTimeLabel = useCallback(
        (time: string, isThird: boolean, open: boolean) => ({
            style: {
                fontSize: 14,
                fontWeight: 600,
                ...(!isThird && { color: "red" }),
            },
            label:
                window.innerWidth <= 1536
                    ? !open
                        ? time.split("-").reverse().splice(0, 2).join(".")
                        : time.split("-").reverse().splice(0, 1).join(".")
                    : time.split("-").reverse().join("."),
        }),
        [],
    );

    useEffect(() => {
        const marks = Object.fromEntries(
            timeList
                .slice(0, SLIDER_MAX + 1)
                .map((time, index) => [index, formatTimeLabel(time, index === SLIDER_DATA_DEFAULT_IDX, openDrawer)]),
        );
        setState((prev) => ({ ...prev, marks }));
    }, [timeList, formatTimeLabel, openDrawer]);

    const updateSliderValue = useCallback(
        (newValue: number) => {
            setState((prev) => ({ ...prev, sliderValue: newValue }));
            setTime(timeList[newValue]);
        },
        [setTime, timeList],
    );

    const stopAnimation = useCallback(() => {
        clearInterval(intervalRef.current);
        setState((prev) => ({ ...prev, isPlaying: false }));
    }, []);

    const startAnimation = useCallback(() => {
        if (state.sliderValue >= SLIDER_MAX) return false;

        const intervalId = setInterval(() => {
            setState((prev) => {
                if (prev.sliderValue < SLIDER_MAX) {
                    setTime(timeList[prev.sliderValue + 1]);
                    return { ...prev, sliderValue: prev.sliderValue + 1 };
                } else {
                    stopAnimation();

                    return { ...prev, isPlaying: false };
                }
            });
        }, ANIMATION_INTERVAL);

        intervalRef.current = intervalId;
        return true;
    }, [state.sliderValue, setTime, timeList, stopAnimation]);

    const handlePlayPause = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isPlaying: prev.isPlaying ? false : startAnimation(),
        }));

        if (state.isPlaying) {
            stopAnimation();
        }
    }, [state.isPlaying, startAnimation, stopAnimation]);

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div
            className={cn(
                "flex h-fit flex-row items-center gap-12 rounded-2xl border-[2pt] border-slate-200 bg-white/80 px-12 py-4 font-sans dark:bg-slate-900/90",
                className,
            )}>
            <Button
                shape="circle"
                type={!state.isPlaying ? "primary" : "default"}
                ghost={state.isPlaying}
                size="large"
                onClick={handlePlayPause}
                className="flex shrink-0 items-center justify-center text-xl"
                style={{ minWidth: 40, minHeight: 40 }}>
                {!state.isPlaying ? (
                    <GoPlay />
                ) : (
                    <AiOutlinePauseCircle
                        color="rgb(64, 150, 255)"
                        className="bg-[#rgb(64, 150, 255)] text-[#rgb(64, 150, 255)]"
                    />
                )}
            </Button>
            {timeList.at(0) && (
                <Slider
                    marks={state.marks}
                    step={1}
                    value={state.sliderValue}
                    max={SLIDER_MAX}
                    tooltip={{
                        formatter: (value?: number) => (value !== undefined ? timeList[value] : ""),
                        autoAdjustOverflow: true,
                    }}
                    onChange={updateSliderValue}
                    className="flex-1 px-2 font-sans"
                    id="time-slider"
                />
            )}
        </div>
    );
};

export default TimeSlider;
