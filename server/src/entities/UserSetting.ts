export class UserSetting {
  public constructor(
    public id: number,
    public user_id: number,
    public profile_url: string,
    public user_location: string /* Ref to district_id */,
    public email_notification: boolean,
    public phone_notification: boolean,
    public deleted?: number,
    public updated_at?: Date | null,
    public created_at?: Date | null
  ) {}
}
