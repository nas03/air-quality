import { getStatisticHistoryByDistrict } from "@/api";
import TemplateCard from "@/components/SideBar/Location/TemplateCard";
import { averageLineChartConfig } from "@/components/SideBar/utils";
import { ChartOptions } from "@/types/components";
import { LineChart } from "@mui/x-charts";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
interface IPropsAverageLineChart {
  className?: string;
  district_id: string;
}

const AverageLineChart: React.FC<IPropsAverageLineChart> = ({ className, district_id }) => {
  const [selectedValue, setSelectedValue] = useState<0 | 1>(0);
  const [chartData, setChartData] = useState<{
    aqi: number[];
    pm25: number[];
    labels: string[];
    location: string;
  }>({ aqi: [], pm25: [], labels: [], location: "" });

  const mutation = useMutation({
    mutationKey: ["district"],
    mutationFn: (district_id: string) => getStatisticHistoryByDistrict(district_id, "2024-11-01", "2024-11-06"),
  });

  useEffect(() => {
    mutation.mutate(district_id);
  }, [district_id]);

  useEffect(() => {
    if (mutation.data) {
      const formattedData = mutation.data.map((el) => ({
        aqi: el.aqi_index,
        pm25: el.pm_25,
        date: el.time.toString().split("T")[0].replace(/-/g, "/"),
      }));
      const firstDataPoint = mutation.data[0];
      const locationString = firstDataPoint
        ? `${firstDataPoint.vn_type} ${firstDataPoint.vn_district}, ${firstDataPoint.vn_province}`
        : "";

      setChartData({
        aqi: formattedData.map(({ aqi }) => aqi),
        pm25: formattedData.map(({ pm25 }) => pm25),
        labels: formattedData.map(({ date }) => date),
        location: locationString,
      });
    }
  }, [mutation.data]);

  const chartOptions: ChartOptions = [
    { label: "AQI", chartType: "aqi" as const, value: 0 as const },
    { label: "PM2.5", chartType: "pm25" as const, value: 1 as const },
  ].map((config) => ({
    label: config.label,
    value: config.value,
    content: (
      <LineChart
        {...averageLineChartConfig[config.value]}
        grid={{ horizontal: true, vertical: true }}
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
      />
    ),
  }));

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

export default AverageLineChart;
