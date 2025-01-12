export class Statistic {
  constructor(
    public district_id: string | null,
    public pm_25: number | null,
    public aqi_index: number | null,
    public time: Date | null,
    public id?: number,
    public deleted?: number,
    public updated_at?: Date | null,
    public created_at?: Date | null
  ) {}
}
