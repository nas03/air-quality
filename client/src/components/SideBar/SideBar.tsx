import { getAllDistricts } from "@/api/districts";
import AverageLineChart from "@/components/SideBar/AverageLineChartTab";
import SearchBar from "@/components/SideBar/SearchBar";
import WarningTab from "@/components/SideBar/WarningTab/WarningTab";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Collapse, CollapseProps } from "antd";
import { useState } from "react";

const SideBar = () => {
  const [targetDistrictID, setTargetDistrictID] = useState<string>("VNM.27.12_1");
  const { data } = useQuery({
    queryKey: ["districts:*"],
    queryFn: getAllDistricts,
  });

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <EnvironmentOutlined className="text-base text-blue-500" />,
      className: "m-0 w-full rounded-md bg-white p-0 [&_.ant-collapse-content-box]:p-0",
      styles: {
        body: {
          paddingRight: 0,
        },
      },
      children: (
        <>
          <div className="h-[calc(100vh-12.3rem)] overflow-y-auto scroll-smooth">
            <h3 className="text-lg font-bold">Điểm đang chọn</h3>
            <WarningTab district_id={targetDistrictID} />
            <AverageLineChart className="w-full" district_id={targetDistrictID} />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="absolute ml-[3rem] mt-[3rem] flex max-h-screen w-[23rem] flex-col gap-5">
      <SearchBar districts={data || []} setTargetDistrict={setTargetDistrictID} className="relative" />
      <Collapse
        expandIconPosition="end"
        defaultActiveKey={["1"]}
        className="relative w-full rounded-md p-0"
        items={items}
      />
    </div>
  );
};

export default SideBar;
