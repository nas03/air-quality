import { cn } from "@/lib/utils";
import { EnvironmentOutlined } from "@ant-design/icons";

export interface IPropsTabButton {
  index: number;
  icon: typeof EnvironmentOutlined;
  activeIndex: number;
  setTabIndex: (index: number) => void;
}
const TabButton = ({ index, icon: Icon, activeIndex, setTabIndex }: IPropsTabButton) => (
  <button
    className={cn(
      "flex w-full items-center justify-center transition-colors hover:text-blue-500",
      index === activeIndex ? "text-blue-600" : "text-gray-400",
      index === 0 && "border-r border-gray-200",
    )}
    onClick={() => setTabIndex(index)}
  >
    <Icon className="text-base" />
  </button>
);

export default TabButton;
