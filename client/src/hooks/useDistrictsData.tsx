import { getAllDistricts } from "@/api";
import { useQuery } from "@tanstack/react-query";

const useAllProvinces = () => {
  const { data, isSuccess } = useQuery({
    queryKey: ["districts:*"],
    queryFn: getAllDistricts,
    select: (data) => [
      ...new Map(data.map((d) => [d.province_id, { value: d.province_id, label: d.vn_province }])).values(),
    ],
  });

  return { data: data ?? [], isSuccess };
};

export default useAllProvinces;
