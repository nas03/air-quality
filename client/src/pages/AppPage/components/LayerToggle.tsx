import { IPropsLayerToggle } from "@/components/types";
import { ConfigContext } from "@/context";
import { cn } from "@/lib/utils";
import { Avatar, Button, Flex } from "antd";
import { useContext, useMemo } from "react";
import { LuWind } from "react-icons/lu";
import { RiRadarLine } from "react-icons/ri";
import { VscChip } from "react-icons/vsc";
interface LayerConfig {
    label: string;
    value: "station" | "model" | "wind";
    icon?: React.ReactNode;
    enabled?: boolean;
}

const LayerToggle: React.FC<IPropsLayerToggle> = ({ className }) => {
    const { layer, setLayer } = useContext(ConfigContext);

    const layerButtons: LayerConfig[] = useMemo(
        () => [
            {
                label: "Trạm quan trắc",
                value: "station",
                icon: <RiRadarLine />,
            },
            {
                label: "Mô hình",
                value: "model",
                icon: <VscChip />,
            },
            {
                label: "Gió",
                value: "wind",
                icon: <LuWind />,
            },
        ],
        [],
    );

    const toggleLayer = (layerValue: string) => {
        setLayer((prevLayer) => ({
            ...prevLayer,
            [layerValue as keyof typeof layer]: !prevLayer[layerValue as keyof typeof layer],
        }));
    };

    const getButtonClassName = (isActive: boolean) =>
        `${isActive ? "bg-[#0057FC] text-white" : "bg-white text-gray-800"}`;

    return (
        <Flex gap="middle" vertical={true} align="end" className={`${className} w-fit`}>
            {layerButtons.map(({ value, label, icon }) => (
                <Button
                    key={value}
                    className={"flex flex-row gap-0 p-0"}
                    onClick={() => toggleLayer(value)}
                    type="text">
                    <span
                        key={`${value}-1`}
                        className={cn(getButtonClassName(layer[value]), "translate-x-2 rounded-l-xl px-3 py-1")}>
                        {label}
                    </span>
                    <Avatar
                        key={`${value}-2`}
                        size={"large"}
                        className={`${layer[value] ? "bg-blue-100" : "bg-gray-100"} ${layer[value] ? "text-blue-700" : "text-gray-700"}`}
                        icon={icon}
                    />
                </Button>
            ))}
        </Flex>
    );
};

export default LayerToggle;
