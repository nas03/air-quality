import TemplateCard from "@/components/SideBar/Location/TemplateCard";
import ModelTab from "@/components/SideBar/Location/WarningTab/ModelTab";
import StationsTab from "@/components/SideBar/Location/WarningTab/StationsTab";
import { IPropsWarningTab } from "@/components/SideBar/Location/WarningTab/types";
import { ChartOptions } from "@/config/constants";
import { useState } from "react";

const WarningTab: React.FC<IPropsWarningTab> = (props) => {
  const [selectedValue, setSelectedValue] = useState<0 | 1>(1);
  const chartOptions: ChartOptions = [
    {
      label: "Trạm",
      value: 0,
      content: <StationsTab district_id={props.district_id} />,
    },
    {
      label: "Mô hình",
      value: 1,
      content: <ModelTab district_id={props.district_id} />,
    },
  ];
  return (
    <>
      <TemplateCard
        key={"warning_tab"}
        descriptionText="Loại dữ liệu"
        selectedValue={selectedValue}
        onValueChange={setSelectedValue}
        chartOptions={chartOptions}
      />
    </>
  );
};

export default WarningTab;
