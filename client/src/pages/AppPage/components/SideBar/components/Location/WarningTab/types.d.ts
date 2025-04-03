export interface DataSourceCardProps {
  data: { source: string; name: string; location: string | string[]; type?: string };
}
export interface AirQualityCardProps {
  data: { status: string; time: string; aqi_index: string; pm_25: string; color: string; icon: string };
}

export interface HealthRecommendationCardProps {
  data: string;
}

export interface IPropsWeatherInfoCard extends React.ComponentPropsWithRef<"div"> {
  data: {
    wind_speed: number;
    temperature: {
      min: number;
      max: number;
      avg: number;
    };
    weather: string;
  };
}

export type DataSourceCardType = {
  name: string;
  location: string | string[];
  type: "station" | "model";
};

export type WeatherInfoCardType = {
  weatherData: Omit<UserAlert, "id" | "aqi_index"> | null;
};

export type AirQualityCardType = {
  aqi_index: string;
  pm_25: string;
  status: string;
  recommendation: string;
};

export interface IPropsAirQualityInfoPanel extends DataSourceCardType, WeatherInfoCardType, AirQualityCardType {
  district_id: string;
  time: string;
}
