import { IPropsLayerToggle } from "@/components/types";
import { ConfigContext } from "@/context";
import { LayerConfig } from "@/types/components";
import { Button, Flex } from "antd";
import { useContext, useMemo } from "react";

const LayerToggle: React.FC<IPropsLayerToggle> = ({ className }) => {
  const { layer, setLayer } = useContext(ConfigContext);

  const layerButtons: LayerConfig[] = useMemo(
    () => [
      {
        label: "Trạm quan trắc",
        value: "station",
      },
      {
        label: "Mô hình",
        value: "model",
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
    `rounded-full ${isActive ? "bg-[#0057FC]" : "bg-white text-black"} px-4 py-2`;

  return (
    <Flex gap="middle" vertical={false} className={`${className} w-fit`}>
      {layerButtons.map(({ value, label }) => (
        <Button
          key={value}
          className={getButtonClassName(layer[value])}
          onClick={() => toggleLayer(value)}
          type="primary"
        >
          {label}
        </Button>
      ))}
    </Flex>
  );
};

export default LayerToggle;
