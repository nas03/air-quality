import { ProvinceData } from "@/api";
import { AnalyticContext } from "@/context";
import useProvinceData from "@/hooks/useProvinceData";
import { cn } from "@/lib/utils";
import { getGradient } from "@/pages/AppPage/components/SideBar/config";
import { aqiThresholds, colorMap, MonitoringData, pm25Thresholds } from "@/types/consts";
import { LineChart } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
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
    setConfig(CHART_CONFIGS[dataType]);
  }, [dataType]);

  useEffect(() => {
    if (provinceData.data?.provinceData) {
      let data: number[] = [];
      if (config.value === MonitoringData.OUTPUT.AQI)
        data = provinceData.data?.provinceData.flatMap((d: ProvinceData) => Math.ceil(d.aqi_index)) ?? [];
      else {
        data = provinceData.data?.provinceData.flatMap((d: ProvinceData) => Number(d.pm_25.toFixed(2))) ?? [];
      }
      setValues(data);
    }
  }, [provinceData.data, config.value]);

  return (
    <div className={cn("flex flex-col justify-center py-5", className)}>
      <p className="flex flex-shrink flex-row items-center gap-2 pl-5 font-semibold">
        <span>
          <SlLocationPin />
        </span>
        {provinceData.isSuccess ? provinceData.data?.provinceData[0].vn_province : "Loading..."}
      </p>
      <div className="h-[80%] w-full flex-grow">
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
          series={[{ id: config.label, data: values, area: true }]}
          sx={{
            "& .MuiAreaElement-root": {
              fill: `url(#${props.chartID.toString()})`,
            },
          }}
          xAxis={[
            {
              scaleType: "point",
              data: dateRange ?? [],
              tickLabelStyle: { angle: -40, textAnchor: "end", fontSize: 13 },
            },
          ]}>
          {getGradient(props.chartID.toString(), values, config.value)}
        </LineChart>
      </div>
    </div>
  );
};

export default DataLineChart;
