
import { MonitoringOutputDataType } from "@/types/types";
import { AreaChartOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

export interface ChartOptions {
  label: string;
  value: MonitoringOutputDataType;
  disabled?: boolean;
  default?: number;
  content: React.ReactNode;
}
interface IPropsTemplateCard {
  className?: string;
  title?: string;
  chartOptions: ChartOptions[];
  selectedValue: 0 | 1;
  onValueChange: (value: 0 | 1) => void;
  descriptionText?: string;
}

const TemplateCard: React.FC<IPropsTemplateCard> = ({
  className,
  chartOptions,
  selectedValue,
  onValueChange,
  descriptionText,
}) => {
  return (
    <div className={className}>
      <Collapse
        expandIconPosition="end"
        defaultActiveKey={["1"]}
        className="relative h-fit w-full rounded-md p-0"
        bordered={false}
        collapsible="icon"
      >
        <Collapse.Panel
          key={1}
          header={
            <>
              <div className="flex w-full flex-row items-center gap-3">
                <AreaChartOutlined className="text-3xl text-blue-600" />
                <div className="flex w-full flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold">{descriptionText}</p>
                  <div className="flex flex-row gap-3 text-xs text-white">
                    {chartOptions.map((option: ChartOptions) => (
                      <button
                        key={option.value}
                        className={`rounded-full ${
                          selectedValue === option.value ? "bg-blue-500" : "bg-slate-400"
                        } px-4 py-1`}
                        disabled={option.disabled && true}
                        onClick={() => onValueChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          }
          className="w-full rounded-md bg-white p-0 first:p-0"
        >
          {chartOptions.find((option: ChartOptions) => option.value === selectedValue)?.content}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default TemplateCard;
