import { DistrictsData } from "@/api";
import { AnalyticContext } from "@/context";
import useGetDistrictData from "@/hooks/useGetDistrictData";
import { cn } from "@/lib/utils";
import { getGradient } from "@/pages/AppPage/components/SideBar/config";
import { aqiThresholds, colorMap, MonitoringData, pm25Thresholds } from "@/types/consts";
import { LineChart } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { CHART_CONFIGS, ChartConfig } from "./config";

interface DataLineChartProps extends React.ComponentPropsWithoutRef<"div"> {
  chartID: number | string;
  loading?: boolean;
}

const SelectedDistrictChart: React.FC<DataLineChartProps> = ({ className, ...props }) => {
  const { dataType, dateRange } = useContext(AnalyticContext);
  const [values, setValues] = useState<number[]>([]);
  const [config, setConfig] = useState<ChartConfig>(CHART_CONFIGS[MonitoringData.OUTPUT.AQI]);
  const analyticContext = useContext(AnalyticContext);
  const selectedDistrictData = useGetDistrictData(analyticContext.selectedDistrict, analyticContext.dateRange);

  useEffect(() => {
    setConfig(CHART_CONFIGS[dataType]);
  }, [dataType]);

  useEffect(() => {
    if (selectedDistrictData.data) {
      let data: number[] = [];
      if (config.value === MonitoringData.OUTPUT.AQI)
        data = selectedDistrictData.data?.flatMap((d: DistrictsData) => Math.ceil(d.aqi_index)) ?? [];
      else data = selectedDistrictData.data?.flatMap((d: DistrictsData) => Number(d.pm_25.toFixed(2))) ?? [];
      setValues(data);
    }
  }, [selectedDistrictData.data, config.value]);

  return (
    <div className={cn("flex flex-col justify-center py-5", className)}>
      <div className="flex flex-row items-center gap-2 pl-5 font-semibold">
        <SlLocationPin />
        <p>
          {selectedDistrictData.isSuccess ? String(selectedDistrictData.data?.[0]?.vn_district || "") : "Đang tải..."}
        </p>
      </div>
      <div className="h-[90%] w-full">
        <LineChart
          grid={{ horizontal: true, vertical: true }}
          margin={{ bottom: 60, left: 60 }}
          yAxis={[
            {
              label: config.label === "AQI" ? "Chỉ số AQI" : "Nồng độ PM2.5 (µg/m³)",
              colorMap: {
                type: "piecewise",
                thresholds: config.value === MonitoringData.OUTPUT.AQI ? aqiThresholds : pm25Thresholds,
                colors: colorMap,
              },
            },
          ]}
          series={[
            {
              id: config.label === "AQI" ? "Chỉ số AQI" : "PM2.5",
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
              tickLabelStyle: { angle: -40, textAnchor: "end", fontSize: 13 },
            },
          ]}>
          {getGradient(props.chartID.toString(), values, config.value)}
        </LineChart>
      </div>
    </div>
  );
};

export default SelectedDistrictChart;
