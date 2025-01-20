export type LayerType = "station" | "model";
export type LayerConfig = {
  label: string;
  value: LayerType;
  enabled?: boolean;
};
export type Path = {
  component: (props: React.ComponentPropsWithoutRef<"div">) => JSX.Element;
  path: string;
};

export interface TimeContextType {
  timeList: string[];
  time: string;
}
export interface GeoContextType {
  coordinate: [number, number] | undefined;
  value: number | undefined;
  location: string;
}
export interface ConfigContextType {
  setLayer: (layer: { station: boolean; model: boolean }) => void;
  layer: {
    station: boolean;
    model: boolean;
  };
}
export interface AuthContextType {
  user?: AuthUser | null;
  token?: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
