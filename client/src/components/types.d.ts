import { MarkData } from "@/types/types";

/* TimeSlider */
export interface IPropsTimeSlider {
    setTime: (value: string | ((prevState: string) => string)) => void;
    openDrawer: boolean;
    className?: string;
}
/* SideBar */
export interface IPropsSideBar extends React.ComponentPropsWithoutRef<"div"> {
    setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
/* OpenLayerMap */
export interface IPropsOpenLayerMap extends React.ComponentPropsWithRef<"div"> {
    setMarkData: React.Dispatch<React.SetStateAction<MarkData>>;
}

/* LayerToggle */
export interface IPropsLayerToggle {
    /* setLayer: (config: { station: boolean; model: boolean }) => void;
  layer: { station: boolean; model: boolean }; */
    className?: string;
}
