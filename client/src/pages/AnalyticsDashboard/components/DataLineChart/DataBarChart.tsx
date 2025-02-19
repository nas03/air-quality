import { AnalyticContext } from "@/context";
import { cn } from "@/lib/utils";
import { MonitoringData } from "@/types/consts";
import { MonitoringOutputDataType } from "@/types/types";
import { BarChart } from "@mui/x-charts"; // Change this import
import React, { useContext, useEffect, useState } from "react";
import { colorConfig } from "./config";

type ChartType = "aqi" | "pm25";

interface ChartConfig {
  label: string;
  chartType: ChartType;
  value: MonitoringOutputDataType;
}

interface DataLineChartProps extends React.ComponentPropsWithoutRef<"div"> {
  data?: unknown[];
}
const CHART_CONFIGS = {
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
const DataBarChart: React.FC<DataLineChartProps> = ({ className }) => {
  const { dataType, dateRange } = useContext(AnalyticContext);
  const [config, setConfig] = useState<ChartConfig>(CHART_CONFIGS[MonitoringData.OUTPUT.AQI]);

  useEffect(() => {
    console.log(dataType);
    setConfig(CHART_CONFIGS[dataType]);
  }, [dataType]);
  const data = [50, 100, 200, 300, 400];

  useEffect(() => {
    const querySelector = document.querySelectorAll("MuiBarElement-series-AQI");
    console.log(querySelector);
  }, []);

  return (
    <div className={cn("flex flex-row justify-center border-2", className)}>
      <div className="h-full w-full p-5">
        <BarChart
          grid={{ horizontal: true, vertical: true }}
          margin={{
            bottom: 60,
            left: 60,
          }}
          series={[
            {
              id: config.label,
              data: data,
            },
          ]}
          yAxis={[
            {
              domainLimit: (min: number, max: number) => {
                const minD = colorConfig[0].color.find((d) => d.min <= min)?.min;
                const maxD = colorConfig[0].color.find((d) => d.max >= max)?.max;
                return {
                  min: Number(minD),
                  max: Number(maxD),
                };
              },
              colorMap: {
                type: "piecewise",
                thresholds: [50, 100, 150, 200, 500],
                colors: ["#009966", "#facf39", "#ea7643", "#fe6a6", "#70006a", "#7e0023"],
              },
            },
          ]}
          xAxis={[
            {
              scaleType: "band",
              data: dateRange ?? [],
              tickLabelStyle: {
                angle: -40,
                textAnchor: "end",
                fontSize: 13,
              },
            },
          ]}
        ></BarChart>
      </div>
    </div>
  );
};

export default DataBarChart;
