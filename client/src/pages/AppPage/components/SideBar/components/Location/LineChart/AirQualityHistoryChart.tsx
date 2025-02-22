import { getStatisticHistoryByDistrict } from "@/api";

import { aqiThresholds, colorMap, MonitoringData, pm25Thresholds } from "@/types/consts";
import { LineChart } from "@mui/x-charts";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getGradient } from "../../../config";
import TemplateCard, { ChartOptions } from "./TemplateCard";

interface ChartDataType {
  aqi: number[];
  pm25: number[];
  labels: string[];
  location: string;
}

interface IPropsAirQualityHistoryChart {
  className?: string;
  district_id: string;
}

const formatDate = (dateString: string) => dateString.split("T")[0].replace(/-/g, "/");

const formatLocation = (data: any) => {
  if (!data?.length) return "";
  const { vn_type, vn_district, vn_province } = data[0];
  if (!vn_district) return vn_province;
  return `${vn_type} ${vn_district}, ${vn_province}`;
};

const AirQualityHistoryChart: React.FC<IPropsAirQualityHistoryChart> = ({ className, district_id }) => {
  const [selectedValue, setSelectedValue] = useState<0 | 1>(0);
  const [chartData, setChartData] = useState<ChartDataType>({
    aqi: [],
    pm25: [],
    labels: [],
    location: "",
  });

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

  const chartOptions: ChartOptions[] = useMemo(
    () =>
      [
        { label: "AQI", chartType: "aqi" as const, value: MonitoringData.OUTPUT.AQI },
        { label: "PM2.5", chartType: "pm25" as const, value: MonitoringData.OUTPUT.PM25 },
      ].map((config) => ({
        label: config.label,
        value: config.value,
        content: (
          <LineChart
            viewBox={{ height: 370, width: 300, x: 0, y: 12 }}
            width={300}
            height={360}
            grid={{ horizontal: true, vertical: true }}
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
            ]}
          >
            {getGradient("gradient-aqi", chartData[config.chartType], config.value)}
          </LineChart>
        ),
      })),
    [chartData],
  );

  return (
    <TemplateCard
      className={className}
      chartOptions={chartOptions}
      selectedValue={selectedValue}
      onValueChange={setSelectedValue}
      descriptionText={`Diễn biến AQI và PM2.5 trung bình ngày của ${chartData.location}`}
    />
  );
};

export default AirQualityHistoryChart;
