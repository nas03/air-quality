import { DistrictsData } from "@/api";
import { AnalyticContext } from "@/context";
import useProvinceData from "@/hooks/useProvinceData";
import { cn } from "@/lib/utils";
import React, { useContext, useEffect, useState } from "react";
import DataDescriptionCard, { CardData } from "./DataDescriptionCard";

interface OverviewCardValues {
    pollutedDistrictsNumber: number;
    mostPollutedDistrict: DistrictsData | null;
    leastPollutedDistrict: DistrictsData | null;
    pollutedDays: number;
}

interface IPropsOverviewCards extends React.ComponentPropsWithoutRef<"div"> {}

const initialValues: OverviewCardValues = {
    pollutedDistrictsNumber: 0,
    mostPollutedDistrict: null,
    leastPollutedDistrict: null,
    pollutedDays: 0,
};

const OverviewCards: React.FC<IPropsOverviewCards> = ({ className }) => {
    const analyticContext = useContext(AnalyticContext);
    const provinceMutation = useProvinceData(analyticContext.province_id, analyticContext.dateRange);
    const [values, setValues] = useState<OverviewCardValues>(initialValues);

    const calculateDistrictPolluteData = (data: DistrictsData[]) => {
        let pollutedDistrictsNumber = 0;
        let mostPollutedDistrict = data[0];
        let leastPollutedDistrict = data[0];

        data.forEach((district) => {
            if (district.aqi_index > 50) {
                pollutedDistrictsNumber += 1;
            }
            if (district.aqi_index > mostPollutedDistrict.aqi_index) {
                mostPollutedDistrict = district;
            }
            if (district.aqi_index < leastPollutedDistrict.aqi_index) {
                leastPollutedDistrict = district;
            }
        });

        return { pollutedDistrictsNumber, mostPollutedDistrict, leastPollutedDistrict };
    };

    const calculatePollutedDays = (provinceData: { aqi_index: number }[]) => {
        return provinceData.reduce((count, day) => (day.aqi_index > 50 ? count + 1 : count), 0);
    };

    useEffect(() => {
        if (provinceMutation.data?.districtsData) {
            const districtStats = calculateDistrictPolluteData(provinceMutation.data.districtsData);
            setValues((prev) => ({ ...prev, ...districtStats }));
        }

        if (provinceMutation.data?.provinceData) {
            const pollutedDays = calculatePollutedDays(provinceMutation.data.provinceData);
            setValues((prev) => ({ ...prev, pollutedDays }));
        }
    }, [provinceMutation.data]);

    const infoCardData: CardData[] = [
        {
            data: [{ content: values.pollutedDays, unit: "Ngày" }],
            header: "số ngày ô nhiễm",
        },
        {
            data: [{ content: values.pollutedDistrictsNumber, unit: "Quận" }],
            header: "Số quận ô nhiễm",
        },
        {
            data: [
                { content: values.leastPollutedDistrict?.vn_district || "", unit: "" },
                { content: Math.ceil(values.leastPollutedDistrict?.aqi_index || 0), unit: "(AQI Index)" },
            ],
            header: "Ít ô nhiễm nhất",
        },
        {
            data: [
                { content: values.mostPollutedDistrict?.vn_district || "", unit: "" },
                { content: Math.ceil(values.mostPollutedDistrict?.aqi_index || 0), unit: "(AQI Index)" },
            ],
            header: "Ô nhiễm nhất",
        },
    ];

    return (
        <div className={cn("flex max-h-[15%] w-full flex-row justify-between gap-5", className)}>
            {infoCardData.map((card, index) => (
                <DataDescriptionCard
                    data={card.data}
                    key={index}
                    header={card.header}
                    className="h-full w-1/4"
                />
            ))}
        </div>
    );
};

export default OverviewCards;
