import { DatePicker, Tabs } from "antd";
import dayjs from "dayjs";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  activeTab: "cron" | "data";
  onTabChange: (tab: "cron" | "data") => void;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  onDateRangeChange: (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => void;
}

const { RangePicker } = DatePicker;

const PageHeader = ({ 
  title = "Admin Console", 
  subtitle, 
  activeTab, 
  onTabChange,
  dateRange,
  onDateRangeChange
}: PageHeaderProps) => {
  return (
    <div className="sticky top-0 z-10">
      <div className="bg-gradient-to-r from-[#003366] to-[#1a237e] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="group relative">
              <img
                src="/logo_no_text.svg"
                alt="Air Quality Logo"
                className="h-8 w-auto transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-blue-100 to-blue-50 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                {title}
              </h1>
              <p className="text-sm font-medium text-gray-200">
                {subtitle || "Monitor and manage scheduled data collection tasks"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-100">Date Range:</span>
            <RangePicker
              value={dateRange}
              onChange={onDateRangeChange}
              className="w-[300px]"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#1a237e]/10 bg-white px-6 shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => onTabChange(key as "cron" | "data")}
          items={[
            {
              key: "cron",
              label: "Cron Management",
            },
            {
              key: "data",
              label: "Data Management",
            },
          ]}
          size="large"
          className="!mb-0"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-transparent"></div>
    </div>
  );
};

export default PageHeader;
