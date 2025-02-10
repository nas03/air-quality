export class UserNotification {
  constructor(
    public id: number,
    public user_id: number | null,
    public location_id: string | null,
    public recommendation_id: number | null,
    public timestamp: Date | null,
    public archived: number | null,
    public aqi_index: number | null
  ) {}
}
