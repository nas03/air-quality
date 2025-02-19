import { LineChartProps } from "@mui/x-charts";

const color = ["#009966", "#facf39", "#ea7643", "#fe6a6", "#70006a", "#7e0023"];
const colorConfig: { [key: number]: { label: string; color: { min: number; max: number }[] } } = {
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
export const getGradient = (data: number[]) => {
  const value = Math.max(...data);
  if (value <= 50)
    return (
      <>
        <defs>
          <linearGradient id="header-shape-gradient" x2="0" y2="1">
            <stop offset="0%" stopColor="#009966" />
            <stop offset="100%" stopColor="#009966" />
          </linearGradient>
        </defs>
      </>
    );
  else if (value <= 100)
    return (
      <>
        <defs>
          <linearGradient id="header-shape-gradient" x2="0" y2="1">
            <stop offset="0%" stopColor="#facf39" />
            <stop offset="100%" stopColor="#009966" />
          </linearGradient>
        </defs>
      </>
    );
  else if (value <= 150)
    return (
      <defs>
        <linearGradient id="header-shape-gradient" x2="0" y2="1">
          <stop offset="0%" stopColor="#ea7643" />
          <stop offset="66.7%" stopColor="#facf39" />
          <stop offset="100%" stopColor="#009966" />
        </linearGradient>
      </defs>
    );
  else if (value <= 200)
    return (
      <defs>
        <linearGradient id="header-shape-gradient" x2="0" y2="1">
          <stop offset="0%" stopColor="#fe6a6a" />
          <stop offset="50%" stopColor="#ea7643" />
          <stop offset="75%" stopColor="#facf39" />
          <stop offset="100%" stopColor="#009966" />
        </linearGradient>
      </defs>
    );
  else if (value <= 500)
    return (
      <defs>
        <linearGradient id="header-shape-gradient" x2="0" y2="1">
          <stop offset="0%" stopColor="#7e0023" />
          <stop offset="20%" stopColor="#70006a" />
          <stop offset="40%" stopColor="#fe6a6a" />
          <stop offset="60%" stopColor="#ea7643" />
          <stop offset="80%" stopColor="#facf39" />
          <stop offset="100%" stopColor="#009966" />
        </linearGradient>
      </defs>
    );
  return null;
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

export const getStyleRankTable = (aqi_index: number) => {
  if (aqi_index < 50) return { status: "Good", color: "#009966" };
  else if (aqi_index < 100) return { status: "Moderate", color: "#FFFF00" };
  else if (aqi_index < 150) return { status: "Unhealthy for Sensitive Groups", color: "#ff9b57" };
  else if (aqi_index < 200) return { status: "Unhealthy", color: "#fe6a6" };
  else if (aqi_index < 300) return { status: "Very Unhealthy", color: "#70006a" };
  else return { status: "Hazardous", color: "#7e0023" };
};

export const getSvgAndColorByAQI = (aqi_index: number) => {
  if (aqi_index < 50) return { icon: "ic-face-green.svg", color: "#009966" };
  else if (aqi_index < 100) return { icon: "ic-face-yellow.svg", color: "#facf39" };
  else if (aqi_index < 150) return { icon: "ic-face-orange.svg", color: "#ea7643" };
  else if (aqi_index < 200) return { icon: "ic-face-red.svg", color: "#f65e5f" };
  else if (aqi_index < 300) return { icon: "ic-face-purple.svg", color: "#a97abc" };
  else return { icon: "ic-face-purple.svg", color: "#a97abc" };
};
