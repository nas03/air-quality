
type UserEmailNotification = {
  user_id: number;
  email: string;
  user_location: string | null;
};
type UserRecommendation = {
  user_id: number;
  email: string;
  user_location: string | null;
  aqi_index: number | null;
  color: string | null;
  recommendation: string | null;
};
export interface IUserSettingRepository {
  userEmailNotificationSettings(): Promise<UserEmailNotification[]>;
  getRecommendation(date: Date, district_id?: string): Promise<UserRecommendation[]>;
  // getRecommendationByLocation(district_id: string): Promise<UserRecommendation[]>;
}
