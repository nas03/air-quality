export interface TimeContextType {
  timeList: string[];
  time: string;
}

export interface GeoContextType {
  type: 0 | 1;
  coordinate: [number, number] | undefined;
  aqi_index: number | null;
  pm_25: number | null;
  location: string;
}

export interface ConfigContextType {
  setLayer: React.Dispatch<
    React.SetStateAction<{
      station: boolean;
      model: boolean;
    }>
  >;
  layer: {
    station: boolean;
    model: boolean;
  };
}

export type AuthUser = {
  user_id: number;
  username: string;
};

export interface AuthContextType {
  user?: AuthUser | null;
  token?: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
