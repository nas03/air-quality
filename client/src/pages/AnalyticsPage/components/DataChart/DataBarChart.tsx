// React and Context
import { AnalyticContext } from "@/context";
import React, { useContext, useEffect, useState } from "react";

// Charts and UI Libraries
import { BarChart, BarChartProps } from "@mui/x-charts";

// Components
import { Loading } from "@/components";

// Utilities
import { cn } from "@/lib/utils";

// Types and Constants
import useProvinceData from "@/hooks/useProvinceData";
import { MonitoringData } from "@/types/consts";
import { CHART_CONFIGS, ChartConfig, yAxisConfig } from "./config";

interface DataBarChartProps extends React.ComponentPropsWithoutRef<"div"> {}

const DataBarChart: React.FC<DataBarChartProps> = ({ className }) => {
    const analyticContext = useContext(AnalyticContext);
    const [config, setConfig] = useState<ChartConfig>(CHART_CONFIGS[MonitoringData.OUTPUT.AQI]);
    const [values, setValues] = useState<{ data: number[]; labels: string[] }>({ data: [], labels: [] });
    const provinceMutation = useProvinceData(analyticContext.province_id, analyticContext.dateRange);

    useEffect(() => {
        setConfig(CHART_CONFIGS[analyticContext.dataType]);
    }, [analyticContext.dataType]);

    useEffect(() => {
        if (provinceMutation.data?.districtsData) {
            let data: number[] = [];
            const districtsData = provinceMutation.data.districtsData.sort(
                (a, b) => a.eng_district.charCodeAt(0) - b.eng_district.charCodeAt(0),
            );
            const districtsLabel = districtsData.flatMap((d) => d.vn_district);
            if (analyticContext.dataType === MonitoringData.OUTPUT.AQI) {
                data = districtsData.flatMap((d) => Math.ceil(Number(d.aqi_index)));
            } else if (analyticContext.dataType === MonitoringData.OUTPUT.PM25) {
                data = districtsData.flatMap((d) => Number(d.pm_25.toFixed(2)));
            }
            setValues({ labels: districtsLabel, data });
        }
    }, [provinceMutation.data?.districtsData, config.value]);

    const chartConfig: BarChartProps = {
        grid: { horizontal: true, vertical: false },
        margin: { bottom: 70, left: 60 },
        series: [
            {
                id: config.label === "AQI" ? "Chỉ số AQI" : "Nồng độ PM2.5",
                data: values.data,
            },
        ],
        xAxis: [
            {
                scaleType: "band",
                data: values.labels,
                tickLabelStyle: { angle: -40, textAnchor: "end", fontSize: 13 },
            },
        ],
    };

    return (
        <Loading loading={!provinceMutation.isSuccess} className={cn("flex flex-row justify-center", className)}>
            <div className="h-full w-full p-5">
                <BarChart {...chartConfig} {...yAxisConfig[config.value]} />
            </div>
        </Loading>
    );
};

export default DataBarChart;
