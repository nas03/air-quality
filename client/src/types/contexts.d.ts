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

export interface AuthContextType {
  user?: AuthUser | null;
  token?: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
