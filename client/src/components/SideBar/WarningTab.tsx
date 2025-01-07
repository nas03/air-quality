import { getStatisticByDistrict } from "@/api";
import TemplateCard from "@/components/SideBar/TemplateCard";
import { TimeContext } from "@/context";
import { useMutation } from "@tanstack/react-query";
import { ReactNode, useContext, useEffect, useState } from "react";
interface IPropsInfoTab {
  district_id: string;
}
interface IPropsWarningTab {
  district_id: string;
}
const InfoTab: React.FC<IPropsInfoTab> = (props) => {
  const { time } = useContext(TimeContext);
  const mutation = useMutation({
    mutationKey: ["district", props.district_id],
    mutationFn: ({ district_id, date }: { district_id: string; date: string }) =>
      getStatisticByDistrict(district_id, date),
  });

  useEffect(() => {
    mutation.mutate({ district_id: props.district_id, date: time });
  }, [props.district_id, time]);

  useEffect(() => {
    if (mutation.data) {
      console.log(mutation.data);
    }
  }, [mutation.data]);

  return <></>;
};
const WarningTab: React.FC<IPropsWarningTab> = (props) => {
  const [selectedValue, setSelectedValue] = useState<0 | 1>(0);
  const chartOptions: { label: string; value: 0 | 1; disabled?: boolean; content: ReactNode }[] = [
    {
      label: "Trạm",
      value: 0,
      disabled: true,
      content: <></>,
    },
    {
      label: "Mô hình",
      value: 1,
      content: <InfoTab district_id={props.district_id} />,
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
