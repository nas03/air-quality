import { AreaChartOutlined } from "@ant-design/icons";
import { Collapse } from "antd";

interface IPropsTemplateCard {
  className?: string;
  title?: string;
  chartOptions: {
    label: string;
    disabled?: boolean;
    value: 0 | 1;
    content: React.ReactNode;
  }[];
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
        className="relative h-fit w-full rounded-md"
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
                    {chartOptions.map((option) => (
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
          className="w-full rounded-md bg-white"
        >
          {chartOptions.find((option) => option.value === selectedValue)?.content}
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
export default TemplateCard;
