import { getProvinceAverage } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

const useProvinceData = (location: string, dateRange: string[]) => {
  const mutation = useMutation({
    mutationKey: ["map"],
    mutationFn: (payload: { province_id: string; start_date: Date; end_date: Date }) =>
      getProvinceAverage(payload.province_id, payload.start_date, payload.end_date),
  });

  useEffect(() => {
    mutation.mutate({
      province_id: location,
      start_date: new Date(dateRange[0]),
      end_date: new Date(dateRange[dateRange.length - 1]),
    });
  }, [dateRange, location]);

  return mutation;
};
export default useProvinceData;
