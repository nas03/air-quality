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

export type UserNotification = {
  aqi_index: number | null;
  archived: number | null;
  id: number;
  location_id: string | null;
  recommendation_id: number | null;
  timestamp: Date;
  user_id: number | null;
};
export type MRecommendation = {
  color: string;
  id: number;
  max_threshold: number;
  min_threshold: number;
  vn_recommendation: string;
  en_recommendation: string;
  en_status: string;
  vn_status: string;
};
