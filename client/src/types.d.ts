export type LayerType = "station" | "model";
export type LayerConfig = {
  label: string;
  value: LayerType;
  enabled?: boolean;
};
