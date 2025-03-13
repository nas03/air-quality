export interface DataSourceCardProps {
  source: string;
  name: string;
  location: string | string[];
  type?: string;
}
export interface AirQualityCardProps {
  status: string;
  time: string;
  aqi_index: string;
  pm_25: string;
  color: string;
  icon: string;
}

export interface HealthRecommendationCardProps {
  recommendation: string;
}

export interface IPropsWeatherInfoCard extends React.ComponentPropsWithRef<"div"> {
  wind_speed: number;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  weather: string;
}
