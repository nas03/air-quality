import { LineChartProps } from "@mui/x-charts";

const color = ["#009966", "#ffd033", "#eb5c33", "#8f0070", "#70006a", "#7e0023"];
const colorConfig: { [key: number]: { label: string; color: { min: number; max: number }[] } } = {
  0: {
    label: "AQI",
    color: [
      { min: 0, max: 100 },
      { min: 100, max: 200 },
      { min: 200, max: 300 },
      { min: 300, max: 400 },
      { min: 400, max: 500 },
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

export const averageLineChartConfig: { [key: string]: Pick<LineChartProps, "viewBox" | "width" | "height" | "yAxis"> } =
  Object.fromEntries(
    Object.entries(colorConfig).map((entry) => {
      const [key, value] = entry;
      const data: Pick<LineChartProps, "viewBox" | "width" | "height" | "yAxis"> = {
        viewBox: { height: 370, width: 300, x: 0, y: 12 },
        width: 300,
        height: 360,
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
