//InfoCards
export interface IPropsDataSourceCard {
  source: string;
  content: React.ReactNode;
}
export interface IPropsAirQualityCard {
  status: string;
  time: string;
  aqi_index: number | null;
  pm_25: number | null;
}

export interface IPropsHealthRecommendationCard {
  recommendation: string;
}

// ModelTab
export interface IPropsModelTab {
  district_id: string;
}

// WarningTab
export interface IPropsWarningTab {
  district_id: string;
}
