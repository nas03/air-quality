import { AnalyticContext } from "@/context";
import { cn } from "@/lib/utils";
import { MonitoringData } from "@/types/consts";
import { MonitoringOutputDataType } from "@/types/types";
import { LineChart } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { dataLineChartConfig } from "./config";
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

const DataLineChart: React.FC<DataLineChartProps> = ({ className }) => {
  const { dataType, dateRange } = useContext(AnalyticContext);
  const [config, setConfig] = useState<ChartConfig>(CHART_CONFIGS[MonitoringData.OUTPUT.AQI]);

  useEffect(() => {
    console.log(dataType);
    setConfig(CHART_CONFIGS[dataType]);
  }, [dataType]);

  return (
    <div className={cn("flex flex-row justify-center border-2", className)}>
      <div className="h-full w-full p-5">
        <LineChart
          {...dataLineChartConfig[config.value]}
          grid={{ horizontal: true, vertical: true }}
          margin={{
            bottom: 60,
            left: 60,
          }}
          series={[
            {
              id: config.label,
              data: [null],
              area: true,
            },
          ]}
          xAxis={[
            {
              scaleType: "point",
              data: dateRange ?? [],
              tickLabelStyle: {
                angle: -40,
                textAnchor: "end",
                fontSize: 13,
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default DataLineChart;
