export class Station {
  constructor(
    public station_id: string | null,
    public status: string | null,
    public lng: number | null,
    public lat: number | null,
    public aqi_index: number | null,
    public timestamp: Date | null,
    public updated_at?: Date | null,
    public created_at?: Date | null
  ) {}
}
