import { Tabs } from "antd";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  activeTab: "cron" | "data";
  onTabChange: (tab: "cron" | "data") => void;
}

const PageHeader = ({ title = "Admin Console", subtitle, activeTab, onTabChange }: PageHeaderProps) => {
  return (
    <div className="sticky top-0 z-10 mb-4 bg-gray-50">
      <div className="px-5 pb-3 pt-4">
        <div className="flex items-center">
          <div className="mr-4">
            <img src="/logo_no_text.png" alt="Air Quality Logo" className="h-14 w-auto" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              {title}
            </h1>
            <p className="text-sm text-gray-500">{subtitle || "Monitor and manage scheduled data collection tasks"}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white px-5 shadow-sm">
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
    </div>
  );
};

export default PageHeader;
