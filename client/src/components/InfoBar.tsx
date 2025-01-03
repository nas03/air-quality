import { Typography } from "antd";
import { LineChart } from "@mui/x-charts";
interface IPropsInfoBar {
  className?: string;
}
interface IPropsTab {
  title: string;
  content?: React.ReactNode;
}
const Tab: React.FC<IPropsTab> = (props) => {
  return (
    <>
      <Typography.Text strong>{props.title}</Typography.Text>
      {props.content}
    </>
  );
};
const InfoBar: React.FC<IPropsInfoBar> = (props) => {
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [
    "Page A",
    "Page B",
    "Page C",
    "Page D",
    "Page E",
    "Page F",
    "Page G",
  ];
  return (
    <div className={props.className}>
      <Typography.Title level={5}>Điểm đang chọn</Typography.Title>
      <Tab
        title="Điểm đang chọn"
        content={
          <>
            <LineChart
              width={300}
              height={300}
              series={[
                { data: pData, label: "pv" },
                { data: uData, label: "uv" },
              ]}
              xAxis={[
                {
                  scaleType: "point",
                  data: xLabels,
                  tickLabelStyle: {
                    angle: -45,
                    textAnchor: "end",
                    fontSize: 12,
                  },
                },
              ]}
            />
          </>
        }
      />
    </div>
  );
};

export default InfoBar;
