import { LineChartProps } from "@mui/x-charts";

interface ColorConfigProps {
  label: string;
  color: { min: number; max: number }[];
}

export const color = ["#009966", "#facf39", "#ea7643", "#fe6a6", "#70006a", "#7e0023"];
export const colorConfig: { [key: number]: ColorConfigProps } = {
  0: {
    label: "AQI",
    color: [
      { min: 0, max: 50 },
      { min: 51, max: 100 },
      { min: 101, max: 150 },
      { min: 151, max: 200 },
      { min: 201, max: 500 },
    ],
  },
  1: {
    label: "PM2.5",
    color: [
      { min: 0, max: 12 },
      { min: 12, max: 36 },
      { min: 36, max: 56 },
      { min: 56, max: 150 },
      { min: 150, max: 200 },
    ],
  },
};

export const dataLineChartConfig: { [key: string]: Pick<LineChartProps, "viewBox" | "width" | "height" | "yAxis"> } =
  Object.fromEntries(
    Object.entries(colorConfig).map((entry) => {
      const [key, value] = entry;
      const data: Pick<LineChartProps, "viewBox" | "width" | "height" | "yAxis"> = {
        yAxis: value.color.map((d, index) => ({
          label: value.label,
          colorMap: {
            type: "continuous",
            min: d.min,
            max: d.max,
            color: [color[index], color[index + 1]],
          },
        })),
      };
      return [key, data];
    }),
  );
