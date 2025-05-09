import { aqiThresholds, colorMap, getGradientDefs, MonitoringData, pm25Thresholds } from "@/types/consts";
import { MonitoringOutputDataType } from "@/types/types";
import { LineChartProps } from "@mui/x-charts";

/* interface ColorConfigProps {
  label: string;
  color: { min: number; max: number }[];
} */

/* export const color = ["#009966", "#facf39", "#ea7643", "#fe6a6", "#70006a", "#7e0023"];
export const colorConfig: { [key: number]: ColorConfigProps } = {
  0: {
    label: "AQI",
    color: [
      { min: 0, max: 50 },
      { min: 51, max: 100 },
      { min: 101, max: 150 },
      { min: 151, max: 200 },
      { min: 201, max: 500 },
    ],
  },
  1: {
    label: "PM2.5",
    color: [
      { min: 0, max: 12 },
      { min: 12, max: 36 },
      { min: 36, max: 56 },
      { min: 56, max: 150 },
      { min: 150, max: 200 },
    ],
  },
}; */

export const getGradientLinearMap = (id: string, data: number[], chartType: MonitoringOutputDataType) => {
    const value = Math.max(...data);
    const configs = {
        [MonitoringData.OUTPUT.AQI]: {
            thresholds: [50, 100, 150, 200, 500],
        },
        [MonitoringData.OUTPUT.PM25]: {
            thresholds: [12, 36, 56, 150, 200],
        },
    };
    const gradientIndex = configs[chartType].thresholds.findIndex((d) => value <= d);
    return getGradientDefs(id)[gradientIndex];
};

export const yAxisConfig: { [key: string]: Pick<LineChartProps, "yAxis"> } = Object.fromEntries(
    Object.entries(MonitoringData.OUTPUT).map(([_key, value]) => {
        const isAQI = Number(value) === MonitoringData.OUTPUT.AQI;
        const thresholds = isAQI ? aqiThresholds : pm25Thresholds;

        const getDomainLimit = (minValue: number, maxValue: number) => {
            const minDomain = minValue < thresholds[0] ? minValue : thresholds.find((d) => minValue >= d);
            const maxDomain = thresholds.find((d) => maxValue <= d);

            return {
                min: Number(minDomain),
                max: Number(maxDomain),
            };
        };

        const axisConfig: Pick<LineChartProps, "yAxis"> = {
            yAxis: [
                {
                    domainLimit: getDomainLimit,
                    colorMap: {
                        type: "piecewise",
                        thresholds,
                        colors: colorMap,
                    },
                },
            ],
        };

        return [value, axisConfig];
    }),
);

export type ChartType = "aqi" | "pm25";
export type ChartConfig = {
    label: string;
    chartType: ChartType;
    value: MonitoringOutputDataType;
};
export const CHART_CONFIGS = {
    [MonitoringData.OUTPUT.AQI]: {
        label: "AQI",
        chartType: "aqi" as ChartType,
        value: MonitoringData.OUTPUT.AQI,
    },
    [MonitoringData.OUTPUT.PM25]: {
        label: "PM2.5",
        chartType: "pm25" as ChartType,
        value: MonitoringData.OUTPUT.PM25,
    },
} as const;
