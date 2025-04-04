export class Statistic {
  constructor(
    public district_id: string,
    public pm_25: number,
    public aqi_index: number,
    public time: Date,
    public id?: number,
    public deleted?: number,
    public updated_at?: Date | null,
    public created_at?: Date | null
  ) {}
}
