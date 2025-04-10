import { getAllDistricts } from "@/api";
import { useQuery } from "@tanstack/react-query";

const useGetAllDistricts = () => {
    const { data, isSuccess } = useQuery({
        queryKey: ["districts:*"],
        queryFn: getAllDistricts,
    });

    return { data: data ?? [], isSuccess };
};

export default useGetAllDistricts;
