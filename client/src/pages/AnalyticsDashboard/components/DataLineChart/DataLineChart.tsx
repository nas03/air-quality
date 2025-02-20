import { AnalyticContext } from "@/context";
import { cn } from "@/lib/utils";
import { getGradient } from "@/pages/AppPage/components/SideBar/config";
import { MonitoringData } from "@/types/consts";
import { LineChart } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { CHART_CONFIGS, ChartConfig } from "./config";

interface DataLineChartProps extends React.ComponentPropsWithoutRef<"div"> {
  data?: unknown[];
}

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
          sx={{
            ".css-10pepo8-MuiAreaElement-root": {
              fill: "url(#header-shape-gradient)",
            },
          }}
          grid={{ horizontal: true, vertical: true }}
          margin={{ bottom: 60, left: 60 }}
          yAxis={[
            {
              label: config.label,
              colorMap: {
                type: "piecewise",
                thresholds:
                  config.value === MonitoringData.OUTPUT.AQI ? [50, 100, 150, 200, 500] : [12, 36, 56, 150, 200],
                colors: ["#009966", "#facf39", "#ea7643", "#fe6a6", "#70006a", "#7e0023"],
              },
            },
          ]}
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
        >
          {getGradient([], config.value)}
        </LineChart>
      </div>
    </div>
  );
};

export default DataLineChart;
