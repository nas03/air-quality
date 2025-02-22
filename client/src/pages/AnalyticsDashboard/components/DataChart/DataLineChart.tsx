import { AnalyticContext } from "@/context";
import useProvinceData from "@/hooks/useProvinceData";
import { cn } from "@/lib/utils";
import { getGradient } from "@/pages/AppPage/components/SideBar/config";
import { aqiThresholds, colorMap, MonitoringData, pm25Thresholds } from "@/types/consts";
import { LineChart } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { CHART_CONFIGS, ChartConfig } from "./config";

interface DataLineChartProps extends React.ComponentPropsWithoutRef<"div"> {
  data?: unknown[];
  chartID: number | string;
  loading?: boolean;
}

const DataLineChart: React.FC<DataLineChartProps> = ({ className, ...props }) => {
  const { dataType, dateRange } = useContext(AnalyticContext);
  const [values, setValues] = useState<number[]>([]);
  const [config, setConfig] = useState<ChartConfig>(CHART_CONFIGS[MonitoringData.OUTPUT.AQI]);
  const analyticContext = useContext(AnalyticContext);
  const provinceData = useProvinceData(analyticContext.province_id, analyticContext.dateRange);
  useEffect(() => {
    console.log(dataType);
    setConfig(CHART_CONFIGS[dataType]);
  }, [dataType]);

  useEffect(() => {
    if (provinceData.data?.provinceData) {
      const data = provinceData.data?.provinceData.flatMap((d: any) => Math.ceil(d.aqi_index)) ?? [];
      setValues(data);
    }
  }, [provinceData.data]);

  return (
    <div className={cn("flex flex-row justify-center", className)}>
      <div className="h-full w-full p-5">
        <LineChart
          grid={{ horizontal: true, vertical: true }}
          margin={{ bottom: 60, left: 60 }}
          yAxis={[
            {
              label: config.label,
              colorMap: {
                type: "piecewise",
                thresholds: config.value === MonitoringData.OUTPUT.AQI ? aqiThresholds : pm25Thresholds,
                colors: colorMap,
              },
            },
          ]}
          series={[
            {
              id: config.label,
              data: values,
              area: true,
            },
          ]}
          sx={{
            "& .MuiAreaElement-root": {
              fill: `url(#${props.chartID.toString()})`,
            },
          }}
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
          {getGradient(props.chartID.toString(), values, config.value)}
        </LineChart>
      </div>
    </div>
  );
};

export default DataLineChart;
