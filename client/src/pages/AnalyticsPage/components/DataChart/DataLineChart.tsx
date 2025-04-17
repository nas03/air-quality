
// Data Types and API
import { ProvinceData } from "@/api";

// Components
import { Loading } from "@/components";

// Context and Hooks
import { AnalyticContext } from "@/context";
import useProvinceData from "@/hooks/useProvinceData";

// Utilities
import { cn } from "@/lib/utils";
import { getGradient } from "@/pages/AppPage/components/SideBar/utils";

// Constants and Types
import { aqiThresholds, colorMap, MonitoringData, pm25Thresholds } from "@/types/consts";

// UI Libraries
import { LineChart } from "@mui/x-charts";
import React, { useContext, useEffect, useState } from "react";
import { SlLocationPin } from "react-icons/sl";
import { CHART_CONFIGS, ChartConfig } from "./config";

interface DataLineChartProps extends React.ComponentPropsWithoutRef<"div"> {
    data?: unknown[];
    chartID: number | string;
    loading?: boolean;
}

const DataLineChart: React.FC<DataLineChartProps> = ({ className, ...props }) => {
    const { dataType, dateRange } = useContext(AnalyticContext);
    const [values, setValues] = useState<number[]>([]);
    const [config, setConfig] = useState<ChartConfig>(CHART_CONFIGS[MonitoringData.OUTPUT.AQI]);
    const analyticContext = useContext(AnalyticContext);
    const provinceData = useProvinceData(analyticContext.province_id, analyticContext.dateRange);

    useEffect(() => {
        setConfig(CHART_CONFIGS[dataType]);
    }, [dataType]);

    useEffect(() => {
        if (provinceData.data?.provinceData) {
            let data: number[] = [];
            if (config.value === MonitoringData.OUTPUT.AQI)
                data = provinceData.data?.provinceData.flatMap((d: ProvinceData) => Math.ceil(d.aqi_index)) ?? [];
            else {
                data = provinceData.data?.provinceData.flatMap((d: ProvinceData) => Number(d.pm_25.toFixed(2))) ?? [];
            }
            setValues(data);
        }
    }, [provinceData.data, config.value]);

    return (
        <Loading loading={!provinceData.isSuccess} className={cn("flex flex-col justify-center py-5", className)}>
            <div className="flex flex-shrink flex-row items-center gap-2 pl-5 font-semibold">
                <span>
                    <SlLocationPin />
                </span>
                <p>
                    {provinceData.isSuccess && provinceData.data?.provinceData.length
                        ? provinceData.data?.provinceData[0].vn_province
                        : "Đang tải..."}
                </p>
            </div>
            <div className="h-[80%] w-full flex-grow">
                <LineChart
                    grid={{ horizontal: true, vertical: true }}
                    margin={{ bottom: 60, left: 60 }}
                    yAxis={[
                        {
                            label: config.label === "AQI" ? "Chỉ số AQI" : "Nồng độ PM2.5 (µg/m³)",
                            colorMap: {
                                type: "piecewise",
                                thresholds: config.value === MonitoringData.OUTPUT.AQI ? aqiThresholds : pm25Thresholds,
                                colors: colorMap,
                            },
                        },
                    ]}
                    series={[
                        {
                            id: config.label === "AQI" ? "Chỉ số AQI" : "PM2.5",
                            data: values,
                            area: true,
                        },
                    ]}
                    sx={{
                        "& .MuiAreaElement-root": {
                            fill: `url(#${props.chartID.toString()})`,
                        },
                    }}
                    xAxis={[
                        {
                            scaleType: "point",
                            data: dateRange ?? [],
                            tickLabelStyle: { angle: -40, textAnchor: "end", fontSize: 13 },
                        },
                    ]}>
                    {getGradient(props.chartID.toString(), values, config.value)}
                </LineChart>
            </div>
        </Loading>
    );
};

export default DataLineChart;
