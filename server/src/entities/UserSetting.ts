export class UserSetting {
  public constructor(
    public id: number | null,
    public user_id: number | null,
    public profile_url: string | null,
    public user_location: string | null /* Ref to district_id */,
    public receive_notifications: number | null,
    public deleted?: number | null,
    public updated_at?: Date | null,
    public created_at?: Date | null
  ) {}
}
