import { getAllDistricts } from "@/api";
import { Loading } from "@/components";
import { AnalyticContext } from "@/context";
import { cn } from "@/lib/utils";
import { MonitoringData } from "@/types/consts";
import { BarChart, BarChartProps } from "@mui/x-charts";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { CHART_CONFIGS, ChartConfig, yAxisConfig } from "./config";

interface DataBarChartProps extends React.ComponentPropsWithoutRef<"div"> {}

const DataBarChart: React.FC<DataBarChartProps> = ({ className }) => {
  const { dataType } = useContext(AnalyticContext);
  const [config, setConfig] = useState<ChartConfig>(CHART_CONFIGS[MonitoringData.OUTPUT.AQI]);
  const data = [50, 100, 200, 300, 400];

  const { data: locations, isSuccess } = useQuery({
    queryKey: ["districts:*"],
    queryFn: getAllDistricts,
    select: (data) =>
      data
        .filter((d) => d.vn_province === "Hà Nội")
        .sort((a, b) => a.eng_district.charCodeAt(0) - b.eng_district.charCodeAt(0))
        .flatMap((d) => d.vn_district),
  });

  useEffect(() => {
    setConfig(CHART_CONFIGS[dataType]);
  }, [dataType]);

  const chartConfig: BarChartProps = {
    grid: { horizontal: true, vertical: true },
    margin: {
      bottom: 70,
      left: 60,
    },
    series: [
      {
        id: config.label,
        data: data,
      },
    ],
    xAxis: [
      {
        scaleType: "band",
        data: locations ?? [],
        tickLabelStyle: {
          angle: -40,
          textAnchor: "end",
          fontSize: 13,
        },
      },
    ],
  };

  return (
    <Loading loading={!isSuccess} className={cn("flex flex-row justify-center border-2", className)}>
      <div className="h-full w-full p-5">
        <BarChart {...chartConfig} {...yAxisConfig[config.value]} />
      </div>
    </Loading>
  );
};

export default DataBarChart;
