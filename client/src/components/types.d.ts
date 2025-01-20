/* TimeSlider */
export interface IPropsTimeSlider {
  setTime: (value: string | ((prevState: string) => string)) => void;
  expanded: boolean;
  className?: string;
}
/* SideBar */
export interface IPropsSideBar {
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}
/* OpenLayerMap */
export interface IPropsOpenLayerMap {
  setMarkData: ({
    coordinate,
    value,
    location,
  }: {
    coordinate: [number, number];
    value: number;
    location: string;
  }) => void;
}

/* LayerToggle */
export interface IPropsLayerToggle {
  /* setLayer: (config: { station: boolean; model: boolean }) => void;
  layer: { station: boolean; model: boolean }; */
  className?: string;
}
