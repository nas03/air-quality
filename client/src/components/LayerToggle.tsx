import { IPropsLayerToggle } from "@/components/types";
import { ConfigContext } from "@/context";
import { LayerConfig } from "@/types/components";
import { Button, Flex } from "antd";
import { useContext } from "react";

const LayerToggle: React.FC<IPropsLayerToggle> = (props) => {
  const configContext = useContext(ConfigContext);
  const buttons: LayerConfig[] = [
    {
      label: "Trạm quan trắc",
      value: "station",
    },
    {
      label: "Mô hình",
      value: "model",
    },
  ];
  return (
    <>
      <Flex gap="middle" vertical={false} className={`${props.className} w-fit`}>
        {buttons.map((option) => (
          <Button
            key={option.value}
            className={`rounded-full ${configContext.layer[option.value] ? "bg-[#0057FC]" : "bg-white text-black"} px-4 py-2`}
            onClick={() => {
              configContext.setLayer({
                ...configContext.layer,
                [option.value]: !configContext.layer[option.value],
              });
            }}
            type="primary"
          >
            {option.label}
          </Button>
        ))}
      </Flex>
    </>
  );
};

export default LayerToggle;
