export type APIResponse<T> = { status: string; data: T; message?: string };

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
  user_id?: number;
  updated_at?: Date | null;
  created_at?: Date | null;
};

export type ChartOptions = {
  label: string;
  value: 0 | 1;
  disabled?: boolean;
  default?: number;
  content: React.ReactNode;
}[];
