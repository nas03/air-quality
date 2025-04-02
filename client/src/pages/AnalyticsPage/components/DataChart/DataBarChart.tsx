import { Loading } from "@/components";
import { AnalyticContext } from "@/context";
import useProvinceData from "@/hooks/useProvinceData";
import { cn } from "@/lib/utils";
import { MonitoringData } from "@/types/consts";
import { BarChart, BarChartProps } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { CHART_CONFIGS, ChartConfig, yAxisConfig } from "./config";

interface DataBarChartProps extends React.ComponentPropsWithoutRef<"div"> {}

const DataBarChart: React.FC<DataBarChartProps> = ({ className }) => {
  const analyticContext = useContext(AnalyticContext);
  const [config, setConfig] = useState<ChartConfig>(CHART_CONFIGS[MonitoringData.OUTPUT.AQI]);
  const [values, setValues] = useState<{ data: number[]; labels: string[] }>({ data: [], labels: [] });
  const provinceMutation = useProvinceData(analyticContext.province_id, analyticContext.dateRange);

  useEffect(() => {
    setConfig(CHART_CONFIGS[analyticContext.dataType]);
  }, [analyticContext.dataType]);

  useEffect(() => {
    if (provinceMutation.data?.districtsData) {
      let data: number[] = [];
      const districtsData = provinceMutation.data.districtsData.sort(
        (a, b) => a.eng_district.charCodeAt(0) - b.eng_district.charCodeAt(0),
      );
      const districtsLabel = districtsData.flatMap((d) => d.vn_district);
      if (config.value === MonitoringData.OUTPUT.AQI) {
        data = districtsData.flatMap((d) => Math.ceil(Number(d.aqi_index)));
      } else {
        data = districtsData.flatMap((d) => Number(d.pm_25.toFixed(2)));
      }
      setValues({ labels: districtsLabel, data });
    }
  });
  const chartConfig: BarChartProps = {
    grid: { horizontal: true, vertical: false },
    margin: { bottom: 70, left: 60 },
    series: [{ id: config.label, data: values.data }],
    xAxis: [
      {
        scaleType: "band",
        data: values.labels,
        tickLabelStyle: { angle: -40, textAnchor: "end", fontSize: 13 },
      },
    ],
  };

  return (
    <Loading loading={!provinceMutation.isSuccess} className={cn("flex flex-row justify-center", className)}>
      <div className="h-full w-full p-5">
        <BarChart {...chartConfig} {...yAxisConfig[config.value]} />
      </div>
    </Loading>
  );
};

export default DataBarChart;
