import { getStatisticHistoryByDistrict } from "@/api";

import { cn } from "@/lib/utils";
import { CHART_CONFIGS, ChartConfig } from "@/pages/AnalyticsDashboard/components/DataChart/config";
import { aqiThresholds, colorMap, MonitoringData, pm25Thresholds } from "@/types/consts";
import { MonitoringOutputDataType } from "@/types/types";
import { LineChart } from "@mui/x-charts";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getGradient } from "../../../config";

interface ChartDataType {
  aqi: number[];
  pm25: number[];
  labels: string[];
  location: string;
}

interface IPropsAirQualityHistoryChart {
  className?: string;
  district_id: string;
  dataType: MonitoringOutputDataType;
  setLocation: React.Dispatch<React.SetStateAction<string>>;
}

const formatDate = (dateString: string) => dateString.split("T")[0].replace(/-/g, "/");

const formatLocation = (data: any) => {
  if (!data?.length) return "";
  const { vn_type, vn_district, vn_province } = data[0];
  if (!vn_district) return vn_province;
  return `${vn_type} ${vn_district}, ${vn_province}`;
};

const AirQualityHistoryChart: React.FC<IPropsAirQualityHistoryChart> = ({
  className,
  district_id,
  dataType,
  setLocation,
}) => {
  const [config, setConfig] = useState<ChartConfig>(CHART_CONFIGS[MonitoringData.OUTPUT.AQI]);
  const [chartData, setChartData] = useState<ChartDataType>({
    aqi: [],
    pm25: [],
    labels: [],
    location: "",
  });

  useEffect(() => {
    console.log(dataType);
    setConfig(CHART_CONFIGS[dataType]);
  }, [dataType]);

  const mutation = useMutation({
    mutationKey: ["district"],
    mutationFn: (id: string) => getStatisticHistoryByDistrict(id, "2024-11-01", "2024-11-06"),
    onSuccess: (data) => {
      const formattedData =
        data?.map((el) => ({
          aqi: el.aqi_index,
          pm25: el.pm_25,
          date: formatDate(el.time.toString()),
        })) ?? [];
      setLocation(formatLocation(data));
      setChartData({
        aqi: formattedData.map(({ aqi }) => aqi),
        pm25: formattedData.map(({ pm25 }) => pm25),
        labels: formattedData.map(({ date }) => date),
        location: formatLocation(data),
      });
    },
  });

  useEffect(() => {
    mutation.mutate(district_id);
  }, [district_id]);

  return (
    <div className={cn(className, "h-[23rem]")}>
      <LineChart
        grid={{ horizontal: true, vertical: true }}
        margin={{ bottom: 70, top: 20, right: 20, left: 50 }}
        yAxis={[
          {
            label: config.label,
            colorMap: {
              type: "piecewise",
              thresholds: dataType === MonitoringData.OUTPUT.AQI ? aqiThresholds : pm25Thresholds,
              colors: colorMap,
            },
          },
        ]}
        sx={{
          "& .MuiAreaElement-root": {
            fill: "url(#gradient-aqi)",
          },
        }}
        series={[{ id: config.label, data: chartData[config.chartType], area: true }]}
        xAxis={[
          {
            scaleType: "point",
            data: chartData.labels,
            tickLabelStyle: {
              angle: -45,
              textAnchor: "end",
              fontSize: 13,
            },
          },
        ]}>
        {getGradient("gradient-aqi", chartData[config.chartType], config.value)}
      </LineChart>
    </div>
  );
};

export default AirQualityHistoryChart;
