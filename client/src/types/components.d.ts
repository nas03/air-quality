export type LayerType = "station" | "model";

export type LayerConfig = {
  label: string;
  value: LayerType;
  enabled?: boolean;
};

export type ChartOptions = {
  label: string;
  value: 0 | 1;
  disabled?: boolean;
  default?: number;
  content: React.ReactNode;
}[];
