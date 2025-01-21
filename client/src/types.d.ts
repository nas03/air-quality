// Route Types
export type Path = {
  component: (props: React.ComponentPropsWithoutRef<"div">) => JSX.Element;
  path: string;
};

// Context Types
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

// API Types
export type APIResponse<T> = { 
  status: string; 
  data: T; 
  message?: string 
};

// Database Model Types
export type MDistrict = {
  district_id: string;
  province_id: string;
  vn_province: string;
  vn_district: string;
  eng_district: string;
  vn_type: string;
  eng_type: string;
  deleted?: number;
  updated_at?: Date;
  created_at?: Date;
};

export type Statistic = {
  id?: number;
  district_id: string;
  pm_25: number;
  aqi_index: number;
  time: Date;
  deleted?: number;
  updated_at?: Date | null;
  created_at?: Date | null;
};

export type User = {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
  user_id?: number;
  updated_at?: Date | null;
  created_at?: Date | null;
};

// UI Component Types
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
