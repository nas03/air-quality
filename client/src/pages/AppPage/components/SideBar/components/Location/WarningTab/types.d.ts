export interface DataSourceInfo {
  name: string;
  location: string | string[];
  source: string;
}

export interface WeatherInfo {
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  weather: string;
  wind_speed: number;
}

export interface AirQualityInfo {
  aqi_index: string;
  pm_25: string;
  status: string;
  time: string;
  color: string;
  icon: string;
}

export interface DataSourceCardProps {
  data: DataSourceInfo;
}

export interface AirQualityCardProps {
  data: AirQualityInfo;
}

export interface HealthRecommendationCardProps {
  data: string;
}

export interface IPropsWeatherInfoCard extends React.ComponentPropsWithRef<"div"> {
  data: WeatherInfo;
  loading?: boolean;
}

export interface WarningTabProps extends React.ComponentPropsWithRef<"div"> {
  district_id: string;
}
