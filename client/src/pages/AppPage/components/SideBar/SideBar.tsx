// React and Context
import { ConfigContext, TimeContext } from "@/context";
import { useContext, useEffect, useState } from "react";

// UI Components and Icons
import { BarChartOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Collapse, CollapseProps } from "antd";

// Data Hooks
import useDistrictRanking, { RankData } from "@/hooks/useDistrictRanking";
import useGetAllDistricts from "@/hooks/useGetAllDistricts";
import { useMutation } from "@tanstack/react-query";

// Local Components
import LocationDataCard from "./components/Location/LineChart/LocationDataCard";
import WarningTab from "./components/Location/WarningTab/WarningTab";
import RankTable from "./components/RankTable";
import SearchBar from "./components/SearchBar";
import TabButton, { IPropsTabButton } from "./components/TabButton";
import TabContent from "./components/TabContent";

// Types
import { IPropsSideBar } from "@/components/types";

// Utilities
import { cn } from "@/lib/utils";
import axios from "axios";
import { GEOSERVER_URL } from "../OpenLayerMap/layers";
import { centerMapOnDistrict } from "./utils";

// Constants
const DEFAULT_DISTRICT = "VNM.27.12_1";

const tabComponents = (targetDistrictID: string, tableData: RankData[], loading: boolean) => [
    {
        component: (
            <TabContent title="Điểm đang chọn" className="scrollbar overflow-y-auto scroll-smooth">
                <WarningTab className="" district_id={targetDistrictID} />
                <LocationDataCard className="h-1/2 w-full" district_id={targetDistrictID} />
            </TabContent>
        ),
    },
    {
        component: (
            <TabContent title="Bảng xếp hạng">
                <RankTable tableData={tableData} loading={loading} />
            </TabContent>
        ),
    },
];

const getCollapseItems = (
    tabIndex: number,
    TabButton: React.FC<IPropsTabButton>,
    tabComponents: Array<{ component: React.ReactNode }>,
    setTabIndex: (index: number) => void,
): CollapseProps["items"] => [
    {
        key: "1",
        label: (
            <div className="flex w-full">
                <TabButton index={0} icon={EnvironmentOutlined} activeIndex={tabIndex} setTabIndex={setTabIndex} />
                <TabButton index={1} icon={BarChartOutlined} activeIndex={tabIndex} setTabIndex={setTabIndex} />
            </div>
        ),
        className: "m-0 w-full rounded-md bg-white p-0 [&_.ant-collapse-content-box]:p-0",
        styles: { body: { paddingRight: 0 } },
        children: tabComponents[tabIndex].component,
    },
];

const SideBar: React.FC<IPropsSideBar> = ({ setExpanded, className }) => {
    const [targetDistrictID, setTargetDistrictID] = useState<string>(DEFAULT_DISTRICT);
    const [tabIndex, setTabIndex] = useState(0);

    const mapMutation = useMutation({
        mutationKey: ["map", location],
        mutationFn: async () => {
            const response = await axios.get(`${GEOSERVER_URL}/wfs`, {
                params: {
                    SERVICE: "WFS",
                    version: "2.0.0",
                    REQUEST: "GetFeature",
                    typename: "air:gadm41_VNM_2",
                    CQL_FILTER: `GID_2='${targetDistrictID}'`,
                    outputFormat: "text/javascript",
                    srsname: "EPSG:3857",
                },
            });
            const jsonStartIndex = response.data.indexOf("{");
            const jsonEndIndex = response.data.lastIndexOf("}") + 1;
            return JSON.parse(response.data.slice(jsonStartIndex, jsonEndIndex));
        },
    });

    const { time } = useContext(TimeContext);
    const { mutation, tableData } = useDistrictRanking(time);
    const { mapRef, markerRef } = useContext(ConfigContext);
    const allDistricts = useGetAllDistricts();

    useEffect(() => {
        if (!mapRef.current) return;
        console.log({ targetDistrictID });
        mapRef.current.getView().setZoom(12);
        mapMutation.mutate();
    }, [targetDistrictID]);

    useEffect(() => {
        const targetDistrictFeatures = mapMutation.data?.features?.[0];
        if (!mapRef.current || !targetDistrictFeatures) return;
        centerMapOnDistrict(mapRef.current, targetDistrictFeatures, markerRef);
    }, [mapMutation.data]);

    useEffect(() => {
        mutation.mutate(time);
    }, [time]);

    return (
        <div className={cn("flex flex-col gap-5", className)}>
            <SearchBar districts={allDistricts.data} setTargetDistrict={setTargetDistrictID} className="relative" />
            <Collapse
                onChange={() => setExpanded((prev) => !prev)}
                expandIconPosition="end"
                defaultActiveKey={["1"]}
                collapsible="icon"
                className="relative w-full rounded-md p-0"
                items={getCollapseItems(
                    tabIndex,
                    TabButton,
                    tabComponents(targetDistrictID, tableData, !mutation.isSuccess),
                    setTabIndex,
                )}
            />
        </div>
    );
};

export default SideBar;
