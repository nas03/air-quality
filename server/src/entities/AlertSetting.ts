export class AlertSetting {
  constructor(
    public id: number,
    public user_id: number,
    public district_id: string,
    public wind_speed: boolean,
    public aqi_index: boolean,
    public pm_25: boolean,
    public temperature: boolean,
    public weather: boolean,
    public receive_notifications: number
  ) {}
}
