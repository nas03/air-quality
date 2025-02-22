import { getStatisticHistoryByDistrict } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const useGetDistrictData = (district_id: string, dateRange: string[]) => {
  const mutation = useMutation({
    mutationKey: ["district", district_id],
    mutationFn: (payload: { district_id: string; start_date: string; end_date: string }) =>
      getStatisticHistoryByDistrict(payload.district_id, payload.start_date, payload.end_date),
  });
  useEffect(() => {
    mutation.mutate({
      district_id: district_id,
      start_date: dateRange[0],
      end_date: dateRange[dateRange.length - 1],
    });
  }, [dateRange, district_id]);

  return mutation;
};

export default useGetDistrictData;
