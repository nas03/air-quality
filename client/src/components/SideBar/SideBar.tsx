import { getAllDistricts } from "@/api/districts";
import AverageLineChart from "@/components/SideBar/AverageLineChartTab";
import SearchBar from "@/components/SideBar/SearchBar";
import WarningTab from "@/components/SideBar/WarningTab";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Collapse } from "antd";
import { useState } from "react";

const SideBar = () => {
  const [targetDistrictID, setTargetDistrictID] = useState<string>("VNM.27.12_1");
  const { data } = useQuery({
    queryKey: ["districts:*"],
    queryFn: getAllDistricts,
  });

  return (
    <div className="absolute left-0 top-0 ml-[3rem] mt-[3rem] flex w-[20rem] flex-col gap-5">
      <SearchBar districts={data || []} setTargetDistrict={setTargetDistrictID} className="relative" />

      <Collapse
        expandIconPosition="end"
        defaultActiveKey={["1"]}
        className="relative h-fit w-full rounded-md"
      >
        <Collapse.Panel
          key={1}
          header={<EnvironmentOutlined className="text-base text-blue-500" />}
          className="w-full rounded-md bg-white"
        >
          <WarningTab district_id={targetDistrictID} />
          <AverageLineChart className="w-full" district_id={targetDistrictID} />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default SideBar;
